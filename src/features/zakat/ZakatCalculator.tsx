import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RefreshCw, Calculator, DollarSign } from 'lucide-react';

const InputField = ({ label, value, onChange, prefix = "$" }: any) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{prefix}</span>
            <input
                type="number"
                min="0"
                placeholder="0"
                value={value || ''}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
        </div>
    </div>
);

const ZakatCalculator = () => {
    // Assets State
    const [cash, setCash] = useState<number>(0);
    const [goldWeight, setGoldWeight] = useState<number>(0);
    const [silverWeight, setSilverWeight] = useState<number>(0);
    const [investments, setInvestments] = useState<number>(0);
    const [loanGiven, setLoanGiven] = useState<number>(0);

    // Liabilities
    const [debts, setDebts] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);

    // Rates (Ideally fetched from API)
    const [goldRate, setGoldRate] = useState<number>(65); // Per gram USD approx
    const [silverRate, setSilverRate] = useState<number>(0.85); // Per gram USD approx

    // Results
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalLiabilities, setTotalLiabilities] = useState(0);
    const [netWorth, setNetWorth] = useState(0);
    const [zakatPayable, setZakatPayable] = useState(0);
    const [nisabStatus, setNisabStatus] = useState<'pending' | 'eligible' | 'not-eligible'>('pending');

    const NISAB_GOLD_GRAMS = 87.48; // 85-87g commonly used
    const NISAB_SILVER_GRAMS = 612.36;

    useEffect(() => {
        const goldValue = goldWeight * goldRate;
        const silverValue = silverWeight * silverRate;

        const assets = cash + goldValue + silverValue + investments + loanGiven;
        const liabilities = debts + expenses;
        const net = Math.max(0, assets - liabilities);

        setTotalAssets(assets);
        setTotalLiabilities(liabilities);
        setNetWorth(net);

        // Nisab Calculation (using Gold standard as safer/more common default for savings, though Silver is lower)
        // Usually lower threshold (Silver) is better for poor, but many scholars say Gold for currency.
        // Let's display both or pick one. We'll stick to Gold value as a robust measure.
        const nisabThreshold = NISAB_GOLD_GRAMS * goldRate;

        if (net >= nisabThreshold) {
            setZakatPayable(net * 0.025);
            setNisabStatus('eligible');
        } else {
            setZakatPayable(0);
            setNisabStatus('not-eligible');
        }

    }, [cash, goldWeight, silverWeight, investments, loanGiven, debts, expenses, goldRate, silverRate]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="text-center space-y-2 py-4">
                <h1 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">Zakat Calculator</h1>
                <p className="text-gray-500 dark:text-gray-400">Calculate your annual obligatory charity (2.5%)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                            <DollarSign size={20} /> Assets (Wealth)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Cash in Hand / Bank" value={cash} onChange={setCash} />
                            <InputField label="Investments / Shares" value={investments} onChange={setInvestments} />
                            <InputField label="Money Owed to You" value={loanGiven} onChange={setLoanGiven} />
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                            <h4 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Gold & Silver</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <InputField label="Gold Weight (grams)" value={goldWeight} onChange={setGoldWeight} prefix="g" />
                                    <InputField label="Current Gold Rate ($/g)" value={goldRate} onChange={setGoldRate} prefix="$" />
                                </div>
                                <div className="space-y-4">
                                    <InputField label="Silver Weight (grams)" value={silverWeight} onChange={setSilverWeight} prefix="g" />
                                    <InputField label="Current Silver Rate ($/g)" value={silverRate} onChange={setSilverRate} prefix="$" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                            <Calculator size={20} /> Liabilities (Deductions)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Outstanding Debts" value={debts} onChange={setDebts} />
                            <InputField label="Expenses Due" value={expenses} onChange={setExpenses} />
                        </div>
                    </Card>
                </div>

                {/* Summary Column */}
                <div className="space-y-4">
                    <Card className="sticky top-24 bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-none shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Summary</h2>
                            <Button variant="glass" size="sm" onClick={() => window.location.reload()}>
                                <RefreshCw size={16} />
                            </Button>
                        </div>

                        <div className="space-y-4 text-emerald-50">
                            <div className="flex justify-between">
                                <span>Total Assets</span>
                                <span>${totalAssets.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Liabilities</span>
                                <span>-${totalLiabilities.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-white/20 my-2"></div>
                            <div className="flex justify-between font-bold text-lg text-white">
                                <span>Net Worth</span>
                                <span>${netWorth.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/20 text-center">
                            <p className="text-sm uppercase tracking-wider mb-2 opacity-80">Zakat Payable (2.5%)</p>
                            <div className="text-4xl font-bold font-mono">
                                ${zakatPayable.toFixed(2)}
                            </div>

                            <div className={`mt-4 px-3 py-1.5 rounded-full text-xs font-bold inline-block ${nisabStatus === 'eligible' ? 'bg-white text-emerald-700' : 'bg-red-500/20 text-white'}`}>
                                {nisabStatus === 'eligible' ? 'ELIGIBLE TO PAY' : 'BELOW NISAB THRESHOLD'}
                            </div>
                        </div>
                    </Card>

                    <Card className="text-xs text-gray-500 space-y-2">
                        <p><strong>Nisab (Gold):</strong> ~${(NISAB_GOLD_GRAMS * goldRate).toFixed(2)} (87.48g)</p>
                        <p><strong>Nisab (Silver):</strong> ~${(NISAB_SILVER_GRAMS * silverRate).toFixed(2)} (612.36g)</p>
                        <p className="italic mt-2">*Calculation based on Gold Nisab standard. Please consult a scholar for specific rulings.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ZakatCalculator;
