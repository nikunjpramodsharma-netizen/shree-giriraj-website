import { ContactCTA } from "@/components/ContactCTA";
import { CONSULT, CONSULT_READY } from "@/lib/consult";

/**
 * The paid consultation band, for the bottom of guide and reference pages.
 *
 * It composes ContactCTA rather than growing a second lead pipeline. The
 * enquiry lands in the same place, carries the same attribution, and is told
 * apart by `formLocation`, so no new translation keys are needed for a
 * consultation intent.
 *
 * Renders nothing at all while CONSULT_READY is false. See lib/consult.ts for
 * why the offer is worded as property consultation and not as legal advice.
 */
export function ConsultCTA({
  locale,
  formLocation,
}: {
  locale: string;
  formLocation: string;
}) {
  if (!CONSULT_READY) return null;

  const fee = CONSULT.feePerHour;

  return (
    <section className="bg-brand-indigo-deep text-paper">
      <div className="wrap py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            <div className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-brass-bright">
              Paid consultation
            </div>
            <h2 className="mt-3 max-w-[20ch] text-2xl text-white md:text-4xl">
              Stuck on something and not buying or selling?
            </h2>
            <p className="mt-5 max-w-[60ch] text-paper/80">
              Everything above is free to read and always will be. If your own
              situation needs someone to actually look at it, you can book time
              with us and pay for the hour.
            </p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="text-sm font-semibold text-white">
                  What people bring us
                </div>
                <ul className="mt-3 space-y-2 text-sm text-paper/75">
                  {CONSULT.what.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span aria-hidden="true" className="text-brass-bright">
                        ·
                      </span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {/* Saying plainly what this is not is the whole reason the
                    offer is defensible. It is not decoration, do not trim it. */}
                <div className="text-sm font-semibold text-white">
                  What it is not
                </div>
                <ul className="mt-3 space-y-2 text-sm text-paper/60">
                  {CONSULT.whatNot.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span aria-hidden="true">·</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-8 max-w-[60ch] text-sm text-paper/70">
              {fee === null ? (
                <>
                  The fee is agreed and confirmed before anything is booked, so
                  you know the cost before you commit to the call.
                </>
              ) : (
                <>
                  ₹{fee.toLocaleString("en-IN")} an hour, billed in{" "}
                  {CONSULT.slotMinutes} minute slots, agreed before the call.
                </>
              )}{" "}
              If what you need turns out to be a lawyer or an accountant, we
              will tell you on the call and point you at one.
            </p>
          </div>

          <ContactCTA
            formLocation={formLocation}
            locale={locale}
            defaultOpen
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}
