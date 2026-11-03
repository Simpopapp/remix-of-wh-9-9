/**
 * Versão COMPLETA de um item do vocabulário (PRD projeto 16, D16-1b/D16-1c):
 * TranslationSheet (container universal do pack — portal, focus trap, bottom
 * sheet mobile / painel central desktop) com as seções fechadas:
 * Recorte → Tradução → Outros sentidos → Fontes → Ações.
 * O card da LISTA é a versão simples (o índice); este sheet é a profundidade.
 */
import { Star, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import type { VocabListItem } from "@/lib/plus/vocab";
import { TYPE_META, positionInType, type TaskType } from "@/lib/pte";
import { TranslationSheet } from "@/components/plus/TranslationSheet";
import { VocabSnippet, VocabSnippetSkeleton } from "@/components/plus/VocabSnippet";
import { cn } from "@/lib/utils";

/** Rótulo do tipo de tarefa (sempre via TYPE_META — nunca hardcode). */
function typeLabel(type: string): string {
  const meta = (TYPE_META as Record<string, { label?: string } | undefined>)[type];
  return meta?.label ?? type;
}

/**
 * Chip de contexto: leva de volta à questão de origem (o "reencontro").
 * Extraído da rota /vocabulary (projeto 10) — consumido pela lista E pelo sheet.
 */
export function SourceChip({ type, qid, extra }: { type: string; qid?: string; extra?: string }) {
  const pos = qid ? positionInType(qid) : { number: 0, total: 0 };
  const label =
    pos.number > 0
      ? `${typeLabel(type)} · q. ${pos.number}/${pos.total}${extra ?? ""}`
      : typeLabel(type);
  if (!qid || pos.number === 0) {
    return (
      <span className="inline-flex max-w-full items-center whitespace-normal rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
        {label}
      </span>
    );
  }
  return (
    <Link
      to="/practice"
      search={{ q: qid }}
      className="inline-flex min-h-11 max-w-full items-center whitespace-normal rounded-full border border-border px-3 py-1 text-xs text-muted-foreground underline-offset-2 transition-colors hover:border-primary/50 hover:text-foreground hover:underline"
    >
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </p>
  );
}

export interface VocabDetailSheetProps {
  /** Item em detalhe (null → sheet fechado). Sempre o item VIVO do store. */
  item: VocabListItem | null;
  /** Recorte efetivo: palavra = snippet ?? derivação; frase = en. */
  snippet?: string;
  /** Derivação em curso (D16-0c) — skeleton, nunca conteúdo falso. */
  snippetLoading?: boolean;
  onClose: () => void;
  onStar: () => void;
  /** Remoção com Desfazer (D15-4c) — resolvida pelo dono da lista. */
  onRemove: () => void;
}

export function VocabDetailSheet({
  item,
  snippet,
  snippetLoading,
  onClose,
  onStar,
  onRemove,
}: VocabDetailSheetProps) {
  if (!item) return null;
  const isPhrase = item.kind === "phrase";
  const hasSenses = !isPhrase && (item.senses?.length ?? 0) > 0;
  const showSnippet = !isPhrase && (snippetLoading === true || snippet !== undefined);

  return (
    <TranslationSheet
      open
      onClose={onClose}
      title={item.en}
      kicker="Studie Plus · Vocabulário"
      ariaLabel={`Detalhe completo de ${item.en}`}
    >
      {showSnippet ? (
        <section aria-label="No contexto original" className="mb-4">
          <SectionLabel>No contexto</SectionLabel>
          <div className="mt-2">
            {snippetLoading === true ? (
              <VocabSnippetSkeleton />
            ) : snippet !== undefined ? (
              <VocabSnippet
                snippet={snippet}
                {...(!isPhrase ? { token: item.en } : {})}
                {...(!isPhrase && item.snippetInContext !== undefined
                  ? { inContext: item.snippetInContext }
                  : {})}
                {...(!isPhrase && item.snippetWhy !== undefined ? { why: item.snippetWhy } : {})}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      <section aria-label="Tradução">
        <SectionLabel>Tradução</SectionLabel>
        <p className="mt-1 text-[15px] font-medium leading-relaxed text-foreground">
          {item.literal}
        </p>
        {item.contextual ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.contextual}</p>
        ) : null}
      </section>

      {hasSenses ? (
        <section
          aria-label="Outros sentidos vistos"
          className="mt-4 border-t border-border/60 pt-3"
        >
          <SectionLabel>Outros sentidos vistos</SectionLabel>
          <ul className="mt-2 space-y-1">
            {(item.senses ?? []).map((s) => (
              <li key={`${s.literal}:${s.ts}`} className="text-sm text-foreground/85">
                {s.literal}
                {s.contextual ? (
                  <span className="text-xs text-muted-foreground"> — {s.contextual}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label="Origem" className="mt-4 border-t border-border/60 pt-3">
        <SectionLabel>Origem</SectionLabel>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>
            traduzida {item.seenCount} {item.seenCount === 1 ? "vez" : "vezes"}
          </span>
          {isPhrase && item.type ? (
            <SourceChip
              type={item.type}
              {...(item.qid !== undefined ? { qid: item.qid } : {})}
              extra={` · frase ${(item.index ?? 0) + 1}`}
            />
          ) : (
            item.sources.map((s) => (
              <SourceChip key={`${s.type}:${s.qid}`} type={s.type} qid={s.qid} />
            ))
          )}
        </div>
      </section>

      {/* Ações: favorito e remoção (com Desfazer no toast — D15-4c) */}
      <div className="mt-5 flex items-center justify-end gap-2 border-t border-border/60 pt-4">
        <button
          type="button"
          aria-pressed={item.starred === true}
          onClick={onStar}
          className={cn(
            "flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors hover:bg-secondary",
            item.starred ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Star className="size-4" strokeWidth={2} aria-hidden />
          {item.starred ? "Nos favoritos" : "Favoritar"}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Trash2 className="size-4" strokeWidth={2} aria-hidden />
          Remover
        </button>
      </div>
    </TranslationSheet>
  );
}
