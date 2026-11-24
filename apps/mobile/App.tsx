import { colors, getHelp, getTerm, typography } from '@billnote/shared'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.brand} accessibilityLabel={getHelp('brand.name')}>
          BILLNOTE
        </Text>
        <Text style={styles.help} accessibilityLabel={getHelp('help.mode')}>
          Help
        </Text>
      </View>
      <Text style={styles.body} accessibilityLabel={getHelp('scaffold.welcome')}>
        Phase 1 mobile scaffold. Login and offline POS arrive in later phases.
      </Text>
      <View
        style={styles.card}
        accessibilityLabel={getHelp('dashboard.todaySales')}
        accessible
      >
        <Text style={styles.cardLabel}>{getTerm('todaySales', 'simple')}</Text>
        <Text style={styles.cardValue}>₹0.00</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.light.paper,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontFamily: typography.fontBrand,
    fontSize: 28,
    color: colors.light.brand,
    fontWeight: '700',
  },
  help: {
    fontSize: 14,
    color: colors.light.ink,
  },
  body: {
    fontSize: typography.bodyMinPx,
    color: colors.light.ink,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.light.card,
    borderColor: colors.light.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 48,
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.light.ink,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.light.good,
  },
})
