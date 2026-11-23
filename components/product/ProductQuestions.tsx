import type { ProductQuestion } from "@/lib/aeo";

/** Visible factual Q&A for answer-engine readability. */
export function ProductQuestions({ questions }: { questions: ProductQuestion[] }) {
  return (
    <section className="space-y-4" aria-labelledby="questions-heading">
      <h2 id="questions-heading" className="text-xl font-semibold">
        Common questions
      </h2>
      <div className="space-y-4">
        {questions.map((item) => (
          <section key={item.question} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-base font-medium text-foreground">{item.question}</h3>
            <p className="mt-2 text-sm text-muted">{item.answer}</p>
            {item.items ? (
              item.format === "steps" ? (
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
                  {item.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                  {item.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              )
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}
