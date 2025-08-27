import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  column: {
    flexDirection: "column",
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: "#1F2937",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#E5E7EB",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  totalValue: {
    fontSize: 12,
    color: "#1F2937",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statusBadge: {
    backgroundColor: "#10B981",
    color: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
});

export interface InvoicePDFProps {
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
    paymentStatus: string;
    totalOrderAmount: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    orderItems: Array<{
      id: string;
      title: string;
      quantity: number;
      price: number;
    }>;
  };
}

export const InvoicePDF = ({ order }: InvoicePDFProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "FAILED":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = order.totalOrderAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>Order #{order.orderNumber}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.value}>{formatDate(order.createdAt)}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.paymentStatus) },
              ]}
            >
              <Text style={{ color: "#FFFFFF" }}>{order.paymentStatus}</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.value}>
            {order.user.firstName} {order.user.lastName}
          </Text>
          <Text style={styles.value}>{order.user.email}</Text>
        </View>

        {/* Order Items Table */}
        <View style={styles.table}>
          <Text style={styles.sectionTitle}>Order Items</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { flex: 3 }]}>Item</Text>
            <Text
              style={[styles.tableCellHeader, { flex: 1, textAlign: "center" }]}
            >
              Qty
            </Text>
            <Text
              style={[styles.tableCellHeader, { flex: 1, textAlign: "right" }]}
            >
              Price
            </Text>
            <Text
              style={[styles.tableCellHeader, { flex: 1, textAlign: "right" }]}
            >
              Total
            </Text>
          </View>

          {/* Table Rows */}
          {order.orderItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.title}</Text>
              <Text
                style={[styles.tableCell, { flex: 1, textAlign: "center" }]}
              >
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {formatCurrency(item.price)}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (10%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>For questions about this invoice, please contact support.</Text>
        </View>
      </Page>
    </Document>
  );
};
