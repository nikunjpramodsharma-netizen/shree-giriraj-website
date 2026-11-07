import { inr, inrShort } from "@/lib/emi";
import { RATE_SOURCES, RATES_VERIFIED_ON } from "@/lib/stampduty";
import { stampExamples, stampRatesTable, yieldExample } from "@/lib/tool-examples";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/**
 * Reference content that sits under a calculator: the rates table and worked
 * examples for stamp duty, a worked example for rental yield. All figures come
 * from lib/tool-examples.ts, which uses the same functions as the tools.
 */
export function ToolExtras({ slug }: { slug: string }) {
  if (slug === "stamp-duty-calculator-mumbai") return <StampExtras />;
  if (slug === "rental-yield-calculator") return <YieldExtras />;
  return null;
}

function StampExtras() {
  const rows = stampRatesTable();
  const ex = stampExamples();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">Stamp duty rates in Mumbai at a glance</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink">
              <th className="py-2 pr-4 font-semibold">Buyer</th>
              <th className="py-2 pr-4 font-semibold">Rate, with metro cess</th>
              <th className="py-2 font-semibold">Duty on ₹1 crore</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.buyer} className="border-b border-line text-ink/80">
                <td className="py-2.5 pr-4">{r.buyer}</td>
                <td className="py-2.5 pr-4">{r.ratePct}%</td>
                <td className="py-2.5 tabular-nums">{inr(r.dutyOnCrore)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-ink/70">
        Registration is 1 percent, capped at {inr(ex.registrationOnCrore)}, so it is {inr(ex.registrationOnCrore)} on ₹1
        crore. Rates checked {fmtDate(RATES_VERIFIED_ON)} against{" "}
        {RATE_SOURCES.length} sources listed under the calculator.
      </p>

      <h2 className="mt-10 text-2xl text-ink md:text-3xl">Three worked examples</h2>
      <p className="mt-2 text-sm text-ink/70">
        Illustrative figures worked out with this calculator, not a quote for a particular flat.
      </p>
      <div className="mt-4 space-y-4 text-ink/85">
        <div className="rounded-xl border border-line p-5">
          <h3 className="font-semibold text-ink">A ₹1.2 crore 2 BHK in Borivali West, bought by a man</h3>
          <p className="mt-2 text-sm">
            Duty at 6 percent is {inr(ex.manFlat.dutyLow)}. Registration is {inr(ex.manFlat.registration)}. Together{" "}
            {inr(ex.manFlat.totalLow)} in cash, on top of the down payment.
          </p>
        </div>
        <div className="rounded-xl border border-line p-5">
          <h3 className="font-semibold text-ink">The same flat in a woman&apos;s sole name</h3>
          <p className="mt-2 text-sm">
            Duty at 5 percent is {inr(ex.womanFlat.dutyLow)}, registration is still {inr(ex.womanFlat.registration)}, so{" "}
            {inr(ex.womanFlat.totalLow)} in all. The saving is {inr(ex.saving)}. It needs a residential flat held in her
            sole name, and adding a male co owner removes it.
          </p>
        </div>
        <div className="rounded-xl border border-line p-5">
          <h3 className="font-semibold text-ink">
            A ₹45 lakh 1 BHK in Malad where the ready reckoner value is higher
          </h3>
          <p className="mt-2 text-sm">
            Say the ready reckoner value is {inrShort(ex.withReckoner.chargeableValue)}. Duty is charged on that, not on
            ₹45 lakh, so a male buyer pays {inr(ex.withReckoner.dutyLow)} instead of {inr(ex.withoutReckoner.dutyLow)}.
            Registration is {inr(ex.withReckoner.registration)}. Check the reckoner value before you agree the price.
          </p>
        </div>
      </div>
    </div>
  );
}

function YieldExtras() {
  const { input, result } = yieldExample();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">A worked example for a Malad flat</h2>
      <p className="mt-2 text-sm text-ink/70">
        Illustrative numbers, the ones the calculator starts with. They are not a rent or a price we are quoting for any
        Malad building.
      </p>
      <div className="mt-4 space-y-3 text-ink/85">
        <p>
          A Malad flat is bought for {inrShort(input.price)} with {inrShort(input.acquisitionCosts)} of buying costs. It lets
          for {inr(input.monthlyRent)} a month, so the rent is {inr(result.grossAnnualRent)} a year. Gross yield is that
          rent over the price: {result.grossYieldPct.toFixed(2)} percent.
        </p>
        <p>
          Now take off {input.vacancyWeeks} empty weeks, maintenance of {inr(input.monthlyMaintenance)} a month,
          property tax of {inr(input.annualPropertyTax)} and {inr(input.annualOtherCosts)} of repairs and the rest.
          Net income is {inr(Math.round(result.netAnnualIncome))} a year. Divided by the total capital of{" "}
          {inrShort(result.totalCapital)}, net yield is {result.netYieldPct.toFixed(2)} percent.
        </p>
      </div>
    </div>
  );
}
