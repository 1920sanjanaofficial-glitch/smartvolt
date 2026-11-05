import os
import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_invoice(
    order_data: dict,
    output_path: str = None
) -> bytes:
    """
    Generates a professional GST tax invoice PDF using ReportLab.
    Compliant with Indian GST standards (HSN/SAC codes, CGST 9%, SGST 9%).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        output_path if output_path else buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    story = []

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4,
        fontName='Helvetica-Bold'
    )
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14
    )
    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#0F172A'),
        fontName='Helvetica-Bold'
    )
    cell_normal = ParagraphStyle(
        'CellNormal',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#1E293B')
    )
    meta_title = ParagraphStyle(
        'MetaTitle',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#64748B'),
        fontName='Helvetica-Bold'
    )

    # 1. Header with Shop Details & Tax Invoice Badge
    header_data = [
        [
            Paragraph("<b>SMARTVOLT ELECTRICALS & ENERGY</b><br/><font size=8 color='#475569'>Industrial Batteries, Inverters & Power Solutions<br/>GSTIN: 27AABCS1429B1Z8 | HSN: 8507<br/>support@smartvolt.com | +91 98200 12345</font>", styles['Normal']),
            Paragraph(f"<font size=14 color='#0284C7'><b>TAX INVOICE</b></font><br/><b>Invoice No:</b> {order_data.get('invoice_number', 'INV-2026-1001')}<br/><b>Date:</b> {order_data.get('date', datetime.date.today().strftime('%d-%b-%Y'))}<br/><b>Order ID:</b> {order_data.get('order_number', 'SV-1001')}", styles['Normal'])
        ]
    ]
    header_table = Table(header_data, colWidths=[320, 220])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # 2. Customer & Billing Details
    cust_data = [
        [
            Paragraph(f"<b>Billed To:</b><br/>{order_data.get('customer_name', 'Customer')}<br/>Phone: {order_data.get('customer_phone', 'N/A')}<br/>Address: {order_data.get('delivery_address', 'Pickup at SmartVolt Center')}", cell_normal),
            Paragraph(f"<b>Payment Information:</b><br/>Status: <b>{order_data.get('payment_status', 'Successful').upper()}</b><br/>Method: {order_data.get('payment_method', 'UPI / QR Code')}<br/>Transaction ID: {order_data.get('transaction_id', 'TXN-9823471')}", cell_normal)
        ]
    ]
    cust_table = Table(cust_data, colWidths=[320, 220])
    cust_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(cust_table)
    story.append(Spacer(1, 15))

    # 3. Itemized Table
    table_headers = [
        Paragraph("<b>#</b>", meta_title),
        Paragraph("<b>Product Description & Electrical Specs</b>", meta_title),
        Paragraph("<b>Warranty</b>", meta_title),
        Paragraph("<b>Qty</b>", meta_title),
        Paragraph("<b>Rate (₹)</b>", meta_title),
        Paragraph("<b>Amount (₹)</b>", meta_title),
    ]

    items_data = [table_headers]
    idx = 1
    for item in order_data.get('items', []):
        desc = f"<b>{item.get('name', 'Product')}</b><br/><font size=7 color='#64748B'>Spec: {item.get('voltage', '')} | {item.get('wattage', '')} | HSN: {item.get('hsn', '8507')}</font>"
        items_data.append([
            Paragraph(str(idx), cell_normal),
            Paragraph(desc, cell_normal),
            Paragraph(f"{item.get('warranty_months', 24)}M", cell_normal),
            Paragraph(str(item.get('quantity', 1)), cell_normal),
            Paragraph(f"{item.get('unit_price', 0.0):,.2f}", cell_normal),
            Paragraph(f"{(item.get('unit_price', 0.0) * item.get('quantity', 1)):,.2f}", cell_normal),
        ])
        idx += 1

    items_table = Table(items_data, colWidths=[24, 256, 60, 40, 80, 80])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 12))

    # 4. Tax Breakup & Grand Total
    subtotal = float(order_data.get('subtotal', 0.0))
    gst_total = float(order_data.get('gst_amount', 0.0))
    cgst = gst_total / 2.0
    sgst = gst_total / 2.0
    discount = float(order_data.get('discount_amount', 0.0))
    delivery = float(order_data.get('delivery_charge', 0.0))
    final_amount = float(order_data.get('total_amount', 0.0))

    summary_data = [
        ["Subtotal:", f"₹ {subtotal:,.2f}"],
        ["CGST (9%):", f"₹ {cgst:,.2f}"],
        ["SGST (9%):", f"₹ {sgst:,.2f}"],
        ["Delivery Charges:", f"₹ {delivery:,.2f}"],
        ["Discounts Applied:", f"- ₹ {discount:,.2f}"],
        ["Total Amount Payable:", f"₹ {final_amount:,.2f}"]
    ]
    summary_table = Table(summary_data, colWidths=[400, 140])
    summary_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('PADDING', (0, 0), (-1, -1), 3),
        ('TEXTCOLOR', (0, 0), (-1, -2), colors.HexColor('#475569')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#0F172A')),
        ('FONTSIZE', (0, -1), (-1, -1), 11),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.HexColor('#0F172A')),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 15))

    # 5. Terms & Warranty Notes
    story.append(Paragraph("<b>Electrical Installation & Warranty Policy:</b>", cell_bold))
    story.append(Paragraph(
        "<font size=7 color='#64748B'>1. Warranty is valid only when installed with proper DC breakers and specified cable gauges.<br/>"
        "2. Keep this invoice and warranty card safe for official battery testing and replacements.<br/>"
        "3. This is a computer-generated authorized GST tax invoice and requires no physical signature.</font>",
        cell_normal
    ))

    doc.build(story)

    if output_path:
        return b""
    buffer.seek(0)
    return buffer.getvalue()
