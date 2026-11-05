import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

# Electrical Constants & Chemistry Parameters
CHEMISTRY_DOD = {
    "LiFePO4": 0.90,       # 90% Depth of Discharge for Lithium Iron Phosphate
    "Li-ion": 0.80,        # 80% DoD for Lithium-Ion
    "Lead-Acid": 0.50,     # 50% max safe DoD for Lead-Acid
    "Tubular": 0.55,       # 55% DoD for Inverter Tubular batteries
    "VRLA": 0.60,          # 60% DoD for Sealed Lead Acid / UPS batteries
    "NiMH": 0.75           # 75% for Nickel-Metal Hydride
}

DEFAULT_INVERTER_EFFICIENCY = 0.90

class SmartVoltElectricalEngine:
    """
    Combines electrical engineering compatibility rules with Scikit-Learn vector similarity
    to recommend physically safe, electrically compatible battery and electrical products.
    """

    @staticmethod
    def calculate_backup_hours(voltage: float, capacity_ah: float, chemistry: str, load_watts: float) -> float:
        """
        Calculates theoretical and practical battery backup runtime:
        T (hours) = (V * Ah * DoD * Efficiency) / Load_Watts
        """
        if load_watts <= 0 or voltage <= 0 or capacity_ah <= 0:
            return 0.0
        
        dod = CHEMISTRY_DOD.get(chemistry, 0.70)
        usable_watt_hours = voltage * capacity_ah * dod * DEFAULT_INVERTER_EFFICIENCY
        hours = usable_watt_hours / load_watts
        return round(float(hours), 2)

    @staticmethod
    def check_technical_compatibility(
        query_voltage: float,
        query_power_watts: float,
        query_capacity_ah: float,
        query_chemistry: str,
        query_connector: str,
        prod_voltage: float,
        prod_power_watts: float,
        prod_capacity_ah: float,
        prod_chemistry: str,
        prod_connector: str,
        stock_qty: int
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Strict electrical engineering gatekeeper.
        NEVER bypasses technical compatibility or stock validation.
        """
        reasons = []
        is_voltage_ok = False
        is_power_ok = False
        is_chem_ok = True
        is_connector_ok = True

        # 1. Voltage validation:
        # Check if nominal voltages match or are within allowable operating rail
        if query_voltage > 0:
            voltage_ratio = abs(prod_voltage - query_voltage) / query_voltage
            if voltage_ratio <= 0.08:  # within 8% standard electrical tolerance
                is_voltage_ok = True
            else:
                reasons.append(f"Voltage mismatch: Product is {prod_voltage}V but required is {query_voltage}V.")
        else:
            is_voltage_ok = True

        # 2. Continuous Power Rating:
        # Product continuous power MUST meet or exceed the required load wattage
        if query_power_watts > 0:
            if prod_power_watts >= query_power_watts:
                is_power_ok = True
            else:
                reasons.append(f"Insufficient continuous power: Rated {prod_power_watts}W is below required {query_power_watts}W.")
        else:
            is_power_ok = True

        # 3. Battery Chemistry validation:
        if query_chemistry and prod_chemistry:
            q_chem = query_chemistry.strip().lower()
            p_chem = prod_chemistry.strip().lower()
            if q_chem in p_chem or p_chem in q_chem:
                is_chem_ok = True
            else:
                reasons.append(f"Chemistry difference: Requested {query_chemistry}, product uses {prod_chemistry}.")

        # 4. Connector Compatibility:
        if query_connector and prod_connector:
            q_conn = query_connector.strip().lower()
            p_conn = prod_connector.strip().lower()
            if q_conn in p_conn or p_conn in q_conn or "universal" in p_conn or "terminal" in p_conn:
                is_connector_ok = True
            else:
                reasons.append(f"Connector format differs: Uses {prod_connector} (Adapter may be required).")

        # 5. Stock verification:
        if stock_qty <= 0:
            reasons.append("Currently out of stock.")

        # Overall strict compatibility
        is_fully_compatible = is_voltage_ok and is_power_ok and is_chem_ok and (stock_qty > 0)

        # Calculate a weighted technical score (0 - 100)
        score = 0.0
        if is_voltage_ok:
            score += 40.0
        if is_power_ok:
            # Reward adequate headroom without extreme over-sizing
            headroom_ratio = prod_power_watts / max(query_power_watts, 1.0)
            if 1.0 <= headroom_ratio <= 2.0:
                score += 35.0
            elif headroom_ratio > 2.0:
                score += 25.0
            else:
                score += 5.0
        if is_chem_ok:
            score += 15.0
        if is_connector_ok:
            score += 10.0

        details = {
            "is_compatible": is_fully_compatible,
            "voltage_compatible": is_voltage_ok,
            "power_compatible": is_power_ok,
            "chemistry_compatible": is_chem_ok,
            "connector_compatible": is_connector_ok,
            "stock_available": stock_qty > 0,
            "score": round(score, 1),
            "reasons": reasons
        }

        return is_fully_compatible, details

    @staticmethod
    def rank_products_ml(
        query: Dict[str, Any],
        products_df: pd.DataFrame
    ) -> pd.DataFrame:
        """
        Uses Scikit-Learn Cosine Similarity on standardized continuous electrical attributes,
        gated by strict rule-based electrical compatibility.
        """
        if products_df.empty:
            return products_df

        df = products_df.copy()

        # Vector features: [voltage, power_watts, capacity_ah, price]
        feature_cols = ['nominal_voltage', 'continuous_power_watts', 'capacity_ah', 'price']
        
        # Fill NAs
        for col in feature_cols:
            if col not in df.columns:
                df[col] = 0.0
            df[col] = df[col].fillna(0.0)

        # Build query vector
        q_v = float(query.get('required_voltage') or 0.0)
        q_w = float(query.get('required_power_watts') or 0.0)
        q_ah = float(query.get('battery_capacity_ah') or 0.0)
        q_budget = float(query.get('budget') or 100000.0)

        query_vec = np.array([[q_v, q_w, q_ah, q_budget]])

        scaler = StandardScaler()
        all_features = np.vstack([df[feature_cols].values, query_vec])
        scaled_features = scaler.fit_transform(all_features)

        prod_scaled = scaled_features[:-1]
        q_scaled = scaled_features[-1].reshape(1, -1)

        sim_scores = cosine_similarity(prod_scaled, q_scaled).flatten()
        df['ml_similarity'] = np.clip(sim_scores, 0.0, 1.0) * 100.0

        # Evaluate rule-based electrical constraints for each row
        results = []
        for _, row in df.iterrows():
            is_compat, details = SmartVoltElectricalEngine.check_technical_compatibility(
                query_voltage=q_v,
                query_power_watts=q_w,
                query_capacity_ah=q_ah,
                query_chemistry=query.get('battery_chemistry', ''),
                query_connector=query.get('connector_type', ''),
                prod_voltage=float(row.get('nominal_voltage', 0.0)),
                prod_power_watts=float(row.get('continuous_power_watts', 0.0)),
                prod_capacity_ah=float(row.get('capacity_ah', 0.0)),
                prod_chemistry=str(row.get('battery_chemistry', '')),
                prod_connector=str(row.get('connector_type', '')),
                stock_qty=int(row.get('stock_quantity', 0))
            )

            # Backup calculation if battery
            backup_hrs = 0.0
            if row.get('capacity_ah', 0.0) > 0 and q_w > 0:
                backup_hrs = SmartVoltElectricalEngine.calculate_backup_hours(
                    voltage=float(row.get('nominal_voltage', 12.0)),
                    capacity_ah=float(row.get('capacity_ah', 100.0)),
                    chemistry=str(row.get('battery_chemistry', 'LiFePO4')),
                    load_watts=q_w
                )

            # Combined score: 60% rule-based safety + 40% ML similarity
            combined_score = (details['score'] * 0.6) + (float(row['ml_similarity']) * 0.4)
            if not is_compat:
                combined_score *= 0.3  # Penalize incompatible products heavily

            results.append({
                'is_compatible': is_compat,
                'compatibility_details': details,
                'backup_hours_estimated': backup_hrs,
                'composite_score': round(combined_score, 1)
            })

        res_df = pd.DataFrame(results)
        df['is_compatible'] = res_df['is_compatible']
        df['compatibility_details'] = res_df['compatibility_details']
        df['backup_hours_estimated'] = res_df['backup_hours_estimated']
        df['composite_score'] = res_df['composite_score']

        # Sort: Compatible first, then by highest composite score
        df = df.sort_values(by=['is_compatible', 'composite_score'], ascending=[False, False])
        return df


class SalesAnalyticsEngine:
    """
    Pandas & NumPy analytics for administrator dashboard:
    Sales revenue, trend analysis, low-stock alerts, and demand forecasting.
    """

    @staticmethod
    def generate_sales_summary(orders_df: pd.DataFrame) -> Dict[str, Any]:
        if orders_df.empty:
            return {
                "total_revenue": 0.0,
                "total_orders": 0,
                "average_order_value": 0.0,
                "gst_collected": 0.0
            }

        total_rev = float(orders_df['total_amount'].sum())
        total_orders = int(len(orders_df))
        aov = round(total_rev / total_orders, 2) if total_orders > 0 else 0.0
        gst = float(orders_df['gst_amount'].sum())

        return {
            "total_revenue": total_rev,
            "total_orders": total_orders,
            "average_order_value": aov,
            "gst_collected": gst
        }
