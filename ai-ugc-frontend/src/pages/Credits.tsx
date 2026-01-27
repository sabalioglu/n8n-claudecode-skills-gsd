import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase, addCredits, getUserTransactions } from '../lib/supabase';
import { formatCredits, formatDate, formatCurrency } from '../lib/utils';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '../components/ui';
import { toast } from 'sonner';
import type { PricingTier } from '../types/database';
import {
  CreditCard,
  Sparkles,
  Check,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Loader2,
  Gift,
  Zap,
} from 'lucide-react';

export function Credits() {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const { data: pricingTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['pricingTiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('credits', { ascending: true });
      if (error) throw error;
      return data as PricingTier[];
    },
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => getUserTransactions(user!.id, 20),
    enabled: !!user,
  });

  const handlePurchase = async (tier: PricingTier) => {
    setSelectedTier(tier.id);
    setPurchasing(true);

    try {
      // In production, this would integrate with Stripe
      // For demo purposes, we'll just add the credits directly
      await addCredits(
        user!.id,
        tier.credits,
        `Purchased ${tier.name} package (${tier.credits} credits)`,
        `demo_${Date.now()}`
      );

      await refreshProfile();
      toast.success(`Successfully purchased ${tier.credits} credits!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to purchase credits');
    } finally {
      setPurchasing(false);
      setSelectedTier(null);
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (type === 'bonus') return <Gift className="w-4 h-4 text-purple-400" />;
    if (amount > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-4">
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-300">Credit Packages</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
        <p className="text-[#94a3b8] max-w-2xl mx-auto">
          Purchase credits to generate AI UGC videos. The more you buy, the
          more you save!
        </p>
      </div>

      {/* Current Balance */}
      <Card className="mb-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/20 rounded-xl">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-[#94a3b8]">Your Current Balance</p>
              <p className="text-3xl font-bold">
                {formatCredits(profile?.credits || 0)}{' '}
                <span className="text-lg font-normal text-[#94a3b8]">
                  credits
                </span>
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[#64748b] text-sm">Estimated videos</p>
            <p className="text-xl font-semibold">
              ~{Math.floor((profile?.credits || 0) / 5)} videos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {tiersLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-64">
                  <div className="h-full bg-[#2d2d4a] rounded-lg" />
                </CardContent>
              </Card>
            ))
        ) : pricingTiers ? (
          pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative overflow-hidden transition-all ${
                tier.is_popular
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
                  : 'hover:border-indigo-500/30'
              }`}
            >
              {tier.is_popular && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardContent className="text-center pt-8">
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    {formatCurrency(tier.price_usd)}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-indigo-400 font-medium">
                    <Zap className="w-5 h-5" />
                    {tier.credits} credits
                  </div>
                  <p className="text-sm text-[#64748b] mt-1">
                    ~{Math.floor(tier.credits / 5)} videos
                  </p>
                </div>

                <ul className="text-sm text-[#94a3b8] space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    All video lengths
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    All platforms
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    No expiration
                  </li>
                </ul>

                <Button
                  variant={tier.is_popular ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handlePurchase(tier)}
                  loading={purchasing && selectedTier === tier.id}
                  disabled={purchasing}
                >
                  {purchasing && selectedTier === tier.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Buy Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : null}
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-400 spinner" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2d2d4a]">
                    <th className="text-left py-3 px-4 text-[#64748b] font-medium text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-[#64748b] font-medium text-sm">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-medium text-sm">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-[#64748b] font-medium text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-[#2d2d4a] last:border-0"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.type, tx.amount)}
                          <Badge
                            variant={
                              tx.type === 'purchase'
                                ? 'success'
                                : tx.type === 'usage'
                                ? 'error'
                                : tx.type === 'bonus'
                                ? 'info'
                                : 'default'
                            }
                          >
                            {tx.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#94a3b8]">
                        {tx.description}
                      </td>
                      <td
                        className={`py-4 px-4 text-right font-medium ${
                          tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount}
                      </td>
                      <td className="py-4 px-4 text-right text-[#64748b] text-sm">
                        {formatDate(tx.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#64748b]">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <h3 className="font-medium mb-2">How many credits per video?</h3>
              <p className="text-sm text-[#94a3b8]">
                Credit usage depends on video length: 12s videos use 5 credits,
                24s videos use 12 credits, and 60s videos use 30 credits.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-medium mb-2">Do credits expire?</h3>
              <p className="text-sm text-[#94a3b8]">
                No! Your credits never expire and can be used anytime.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-medium mb-2">Can I get a refund?</h3>
              <p className="text-sm text-[#94a3b8]">
                Unused credits can be refunded within 30 days of purchase.
                Contact support for assistance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-medium mb-2">What payment methods?</h3>
              <p className="text-sm text-[#94a3b8]">
                We accept all major credit cards, debit cards, and PayPal
                through our secure payment processor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
