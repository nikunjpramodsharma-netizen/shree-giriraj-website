import { inr, inrShort } from "@/lib/emi";
import { RATE_SOURCES, RATES_VERIFIED_ON } from "@/lib/stampduty";
import {
  areaExample,
  emiExample,
  hraExample,
  propertyTaxExample,
  rentAgreementExample,
  stampExamples,
  stampRatesTable,
  yieldExample,
} from "@/lib/tool-examples";
import { waLink } from "@/lib/config";
import { TOOL_NEXT_STEP } from "@/lib/tool-next-step";
import EnglishLink from "next/link";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/**
 * Reference content that sits under a calculator: the rates table and worked
 * examples for stamp duty, a worked example for rental yield. All figures come
 * from lib/tool-examples.ts, which uses the same functions as the tools.
 */
export function ToolExtras({ slug }: { slug: string }) {
  return (
    <>
      {slug === "stamp-duty-calculator-mumbai" && <StampExtras />}
      {slug === "rental-yield-calculator" && <YieldExtras />}
      {slug === "carpet-area-calculator" && <AreaExtras />}
      {slug === "home-loan-emi-calculator" && <EmiExtras />}
      {slug === "bmc-property-tax-calculator" && <PropertyTaxExtras />}
      {slug === "rent-agreement-stamp-duty-calculator-mumbai" && <RentAgreementExtras />}
      {slug === "hra-calculator-rent-receipts" && <HraExtras />}
      <NextStep slug={slug} />
    </>
  );
}

/** The step after the number: one warm offer for the reader this tool serves, plus the pages that follow from it. */
function NextStep({ slug }: { slug: string }) {
  const step = TOOL_NEXT_STEP[slug];
  if (!step) return null;
  return (
    <section className="mt-10 rounded-xl border border-bronze/40 bg-bronze/10 p-5" aria-labelledby="next-step">
      <h2 id="next-step" className="text-xl text-ink md:text-2xl">
        {step.heading}
      </h2>
      <p className="mt-2 max-w-[60ch] text-sm text-ink/85">{step.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={waLink(step.message)}
          data-wa-cta="tool-next-step"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white"
        >
          {step.button}
        </a>
        {step.links.map((l) => (
          <EnglishLink
            key={l.href}
            href={l.href}
            prefetch={false}
            className="text-sm text-brand-indigo underline underline-offset-4"
          >
            {l.label}
          </EnglishLink>
        ))}
      </div>
    </section>
  );
}

function AreaExtras() {
  const a = areaExample();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">How to convert carpet area to built up and super built up area</h2>
      <p className="mt-3 text-ink/85">
        Super built up area is carpet area times one plus the loading, and built up area is carpet area plus the walls
        and balcony. Going the other way, divide. Here are the steps for one flat, at {a.loading} percent loading and{" "}
        {a.wallPct} percent for walls.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink">
              <th className="py-2 pr-4 font-semibold">You know</th>
              <th className="py-2 pr-4 font-semibold">Formula</th>
              <th className="py-2 font-semibold">Result for this flat</th>
            </tr>
          </thead>
          <tbody className="text-ink/80">
            <tr className="border-b border-line">
              <td className="py-2.5 pr-4">Carpet {a.carpet} sq ft ({a.carpetSqm} sq m)</td>
              <td className="py-2.5 pr-4">Carpet × (1 + loading)</td>
              <td className="py-2.5 tabular-nums">Super built up {a.superArea} sq ft</td>
            </tr>
            <tr className="border-b border-line">
              <td className="py-2.5 pr-4">Carpet {a.carpet} sq ft</td>
              <td className="py-2.5 pr-4">Carpet × (1 + wall allowance)</td>
              <td className="py-2.5 tabular-nums">Built up about {a.builtUp} sq ft</td>
            </tr>
            <tr className="border-b border-line">
              <td className="py-2.5 pr-4">Super built up {a.superArea} sq ft</td>
              <td className="py-2.5 pr-4">Super built up ÷ (1 + loading)</td>
              <td className="py-2.5 tabular-nums">Carpet {a.backToCarpet} sq ft</td>
            </tr>
            <tr className="border-b border-line">
              <td className="py-2.5 pr-4">Super built up {a.superMid} sq ft</td>
              <td className="py-2.5 pr-4">Same formula</td>
              <td className="py-2.5 tabular-nums">Carpet about {a.carpetFrom1000} sq ft</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-ink/70">
        Illustrative figures worked with this calculator. Your building&apos;s loading is in its agreement or its RERA
        registration, so enter that rather than ours.
      </p>

      <h2 className="mt-10 text-2xl text-ink md:text-3xl">How do I convert MOFA carpet area to RERA carpet area?</h2>
      <p className="mt-3 text-ink/85">
        A MOFA carpet area can be larger than the RERA carpet area for the same flat, because MOFA era agreements
        counted balconies and RERA does not. RERA carpet area is the net usable floor area, including the internal
        partition walls and excluding external walls, service shafts, exclusive balconies and open terraces.
      </p>
      <p className="mt-3 text-ink/85">
        So the working conversion is the MOFA figure less the balcony area, where the agreement counted it. A flat sold
        at {a.mofaCarpet} sq ft MOFA carpet that included a {a.balcony} sq ft balcony has a RERA carpet of about{" "}
        {a.reraCarpet} sq ft. Maharashtra RERA has described the two as a difference in how the area is measured, not a
        change in the flat.
      </p>
      <p className="mt-3 text-sm text-ink/70">
        Source: Maharashtra RERA order of 17 August 2021 in Deepak Pande v Larsen and Toubro, as reported by{" "}
        <a
          href="https://accommodationworld.in/carpet-area-in-mofa-vs-rera-no-actual-difference-but-matter-of-only-methodology-maha-rera/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-indigo underline underline-offset-4"
        >
          Accommodation World
        </a>
        , read on 16 November 2026. For your flat, the MahaRERA project page and the agreement for sale carry the carpet
        area that counts.
      </p>
    </div>
  );
}

function EmiExtras() {
  const e = emiExample();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">A worked example for a ₹1.2 crore flat</h2>
      <p className="mt-2 text-sm text-ink/70">
        Illustrative: a 20 percent down payment, an 8.5 percent rate over 20 years and 6 percent stamp duty. Your
        lender&apos;s rate decides the real EMI.
      </p>
      <div className="mt-4 space-y-3 text-ink/85">
        <p>
          On a flat of {inrShort(e.price)}, the down payment is {inrShort(e.downPayment)} and the loan is{" "}
          {inrShort(e.loan)}. The EMI is about {inr(e.emi)} a month.
        </p>
        <p>
          Stamp duty is {inr(e.stampDuty)} and registration is {inr(e.registration)}, both in cash. The cash needed on
          the day, before brokerage and interiors, is about {inrShort(e.cashNeeded)}.
        </p>
      </div>
    </div>
  );
}

function PropertyTaxExtras() {
  const { input, result, exemptBelow } = propertyTaxExample();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">A worked example for a {input.carpetSqft} sq ft flat</h2>
      <p className="mt-2 text-sm text-ink/70">
        Illustrative. The reckoner rate of {inr(input.reckonerRatePerSqm)} per sq m is an input for the example, not
        your zone&apos;s rate: look yours up under e-ASR on the IGR portal.
      </p>
      <div className="mt-4 space-y-3 text-ink/85">
        <p>
          A {input.carpetSqft} sq ft carpet home, {input.ageYears} years old, on floor {input.floor} with a lift, is above
          the {exemptBelow} sq ft exemption, so tax applies. Its capital value works out at{" "}
          {inr(Math.round(result.capitalValue))}.
        </p>
        <p>
          At {result.taxRatePct} percent a year, the BMC property tax is about {inr(Math.round(result.taxPayable))}. A
          home of {exemptBelow} sq ft carpet or less would pay nothing.
        </p>
      </div>
    </div>
  );
}

function RentAgreementExtras() {
  const { input, result: r } = rentAgreementExample();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">A worked example for an 11 month agreement</h2>
      <p className="mt-2 text-sm text-ink/70">
        Illustrative: rent of {inr(input.monthlyRent)} a month and a refundable deposit of {inr(input.refundableDeposit)}.
      </p>
      <div className="mt-4 space-y-3 text-ink/85">
        <p>
          Rent for the term is {inr(r.totalRent)}. Notional interest on the deposit is {inr(r.notionalInterest)}. The
          duty is 0.25 percent of the two together, which is {inr(r.stampDuty)}.
        </p>
        <p>
          Add the registration fee of {inr(r.registrationFee)} and the handling charge of {inr(r.handlingCharge)}, and the
          government charges come to {inr(r.total)}.
        </p>
      </div>
    </div>
  );
}

function HraExtras() {
  const { input, result: r } = hraExample();
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink md:text-3xl">A worked example for a Mumbai tenant</h2>
      <p className="mt-2 text-sm text-ink/70">
        Illustrative: basic pay of {inr(input.monthlyBasic)}, HRA received of {inr(input.monthlyHra)} and rent of{" "}
        {inr(input.monthlyRent)}, all a month.
      </p>
      <div className="mt-4 space-y-3 text-ink/85">
        <p>
          The three figures for the year are {inr(r.limbHraReceived)} HRA received, {inr(r.limbRentLessTenPct)} for rent
          less 10 percent of basic, and {inr(r.limbSalaryPct)} for {r.salaryPctUsed} percent of basic.
        </p>
        <p>The smallest is the exemption: {inr(r.exempt)} a year.</p>
      </div>
    </div>
  );
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
      <p className="mt-5 text-sm text-ink/80">
        For the full explanation of each charge, read{" "}
        <EnglishLink
          href="/blog/stamp-duty-and-registration-charges-mumbai"
          prefetch={false}
          className="text-brand-indigo underline underline-offset-4"
        >
          stamp duty and registration charges in Mumbai
        </EnglishLink>
        .
      </p>
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
