// Centralized image registry for SmartVolt Electrical Systems
// Direct imports ensure Vite processes and hashes assets reliably in both dev and production

import heroImg from './images/hero_smartvolt_power_1793862945626.jpg';
import batIndImg from './images/cat_batteries_industrial_1793862945917.jpg';
import batMarineImg from './images/marine_rv_battery_1793864874792.jpg';
import powEqImg from './images/cat_power_equipment_1793862946892.jpg';
import solInvImg from './images/cat_solar_inverter_system_1793862947429.jpg';
import solPanelImg from './images/solar_panel_550w_1793864859641.jpg';
import bldcMotorImg from './images/bldc_motor_pack_1793864891230.jpg';
import andersonCablesImg from './images/anderson_cable_kit_1793864905250.jpg';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  specs: string;
  voltage: string;
  wattage: string;
  chemistry?: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export const APP_IMAGES = {
  hero: heroImg,
  batteryIndustrial: batIndImg,
  batteryMarine: batMarineImg,
  powerEquipment: powEqImg,
  solarInverter: solInvImg,
  solarPanel: solPanelImg,
  bldcMotor: bldcMotorImg,
  andersonCables: andersonCablesImg,
};

export const HARDWARE_GALLERY: GalleryItem[] = [
  {
    id: 'ess-rack',
    title: 'Energex Industrial ESS Cabinet & Telemetry Rack',
    subtitle: 'High-Density 48V-400V Rackmount System',
    category: 'Energy Storage Systems',
    specs: '400V DC High Voltage / 315A Continuous Current',
    voltage: '400V / 48V',
    wattage: '400kW Peak / 1.2MWh',
    chemistry: 'LiFePO4 ESS Grade',
    description: 'Utility-scale energy storage system equipped with dual liquid-cooled LiFePO4 packs, industrial busbars, touch telemetry console, and active grid synchronizer.',
    imageUrl: heroImg,
    tags: ['Industrial ESS', 'Rackmount', 'High Voltage', 'Grid Tied']
  },
  {
    id: 'battery-ind',
    title: 'SmartVolt 48V 100Ah LiFePO4 Industrial Battery Module',
    subtitle: 'Heavy-Duty Server Rack Enclosure',
    category: 'Batteries',
    specs: '48.2V Nominal · 4,800W Continuous Output',
    voltage: '48V DC',
    wattage: '4,800W (9.6kW Surge)',
    chemistry: 'LiFePO4 Grade-A Cells',
    description: 'High-amperage lithium iron phosphate storage module with dual solid brass M8 bolt terminals, front LED voltage display, and 100A continuous Bluetooth BMS.',
    imageUrl: batIndImg,
    tags: ['LiFePO4', '48V System', 'Solar Storage', 'BMS Protected']
  },
  {
    id: 'battery-marine',
    title: 'WaveFlow 12.8V 100Ah Waterproof Marine & RV Battery',
    subtitle: 'IP67 Sealed Deep-Cycle Lithium Pack',
    category: 'Batteries',
    specs: '12.8V · 1280Wh Capacity · Built-in Carry Strap',
    voltage: '12.8V DC',
    wattage: '1,280W Continuous (100A Discharge)',
    chemistry: 'Deep-Cycle LiFePO4',
    description: 'Drop-in lead-acid replacement built for marine trolling motors, campers, and RV house power. Features rugged shockproof housing, illuminated SOC display, and low-temp protection.',
    imageUrl: batMarineImg,
    tags: ['Marine Grade', '12V Deep Cycle', 'IP67 Waterproof', 'Lightweight']
  },
  {
    id: 'solar-inverter',
    title: 'Solarchron H5K Pure Sine Wave Hybrid Solar Inverter',
    subtitle: '5000W Output with 100A MPPT Charge Controller',
    category: 'Power Equipment',
    specs: '5000W Continuous · 230V Pure Sine Wave (<2% THD)',
    voltage: '48V DC Battery / 230V AC',
    wattage: '5,000W Continuous (10,000W Surge)',
    description: 'Next-generation hybrid inverter featuring high-contrast blue telemetry screen, dual high-volume whisper cooling fans, 5240W PV array support, and heavy copper terminal block.',
    imageUrl: solInvImg,
    tags: ['Hybrid Inverter', 'Pure Sine Wave', '100A MPPT', 'Off-Grid/Hybrid']
  },
  {
    id: 'solar-panel',
    title: 'SmartVolt 550W Mono-PERC Bifacial Solar Panel Module',
    subtitle: '144 Half-Cut Monocrystalline Dual-Glass Panel',
    category: 'Solar Products',
    specs: '41.8V Vmp / 13.16A Imp · 21.5% Cell Efficiency',
    voltage: '41.8V Vmp (49.5V Voc)',
    wattage: '550W STC (+25% Bifacial Gain)',
    description: 'High-output bifacial photovoltaic panel with anodized black aluminum frame, anti-reflective tempered glass, multi-busbar technology, and IP68 MC4 waterproof connectors.',
    imageUrl: solPanelImg,
    tags: ['Bifacial', '550W Monocrystalline', 'Half-Cut Cells', 'Grade A+']
  },
  {
    id: 'bench-power',
    title: 'Rigol DP832 Precision Lab Programmable DC Power Supply',
    subtitle: '30V 5A Dual-Channel Regulated Linear Supply',
    category: 'Power Equipment',
    specs: '0-30V / 0-5A Multi-Channel with Digital Readout',
    voltage: '0 - 30V Regulated',
    wattage: '150W Linear Low-Ripple',
    description: 'Laboratory grade DC power source with high-resolution dual 4-digit LED displays, constant voltage/constant current auto-crossover, and banana binding post connectors.',
    imageUrl: powEqImg,
    tags: ['Lab Benchtop', 'Linear PSU', 'Voltage Regulator', 'Low Ripple']
  },
  {
    id: 'bldc-motor',
    title: 'SmartVolt 48V 1500W High-Torque Brushless DC (BLDC) Motor',
    subtitle: 'Neodymium Industrial Rotor with Keyed Drive Shaft',
    category: 'Other Electrical Equipment',
    specs: '48VDC · 6.2 N.m Torque · 2800 RPM · IP65 Casing',
    voltage: '48V DC',
    wattage: '1,500W (2,500W Peak)',
    description: 'High efficiency three-phase brushless motor with heavy extruded aluminum cooling ribs, precision ground steel shaft, and shielded 5-pin Hall sensor wiring harness.',
    imageUrl: bldcMotorImg,
    tags: ['BLDC Motor', '48V High Torque', 'Hall Sensor', 'Electric Drive']
  },
  {
    id: 'anderson-cables',
    title: 'Heavy-Duty Anderson SB50 50A Plugs & 2 AWG Copper Cable Kit',
    subtitle: 'Silver-Plated Contacts with OFC Ultra-Flex Silicone Wire',
    category: 'Electrical Accessories',
    specs: '50A 600V Rated · 2 AWG (35mm²) Pure Copper · M8 Lugs',
    voltage: 'Up to 600V DC/AC',
    wattage: '6,000W Peak DC Transfer',
    description: 'Mechanically keyed Anderson SB50 quick disconnect couplings paired with flexible 2 AWG tinned pure copper wire and heavy duty gold/tin plated M8 ring eyelet terminals.',
    imageUrl: andersonCablesImg,
    tags: ['Anderson SB50', '2 AWG Pure Copper', 'Quick Connect', 'Low Resistance']
  }
];
