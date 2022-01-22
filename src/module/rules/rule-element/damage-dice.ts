import { RuleElementPF2e, RuleElementData } from "./";
import { CharacterPF2e, NPCPF2e } from "@actor";
import { DamageDicePF2e } from "@module/modifiers";

/**
 * @category RuleElement
 */
export class DamageDiceRuleElement extends RuleElementPF2e {
    override beforePrepareData(): void {
        this.data.diceNumber = Number(this.resolveValue(this.data.diceNumber));
        const value: Omit<DamageDiceRuleElementData, "key"> & { key?: string } = deepClone(this.data);
        delete value.key;
        if (this.data.value) {
            const bracketed = this.resolveValue(this.data.value);
            mergeObject(value, bracketed, { inplace: true, overwrite: true });
            delete value.value;
        }
        const selector = this.resolveInjectedProperties(value.selector);
        // In English (and in other languages when the same general form is used), labels patterned as
        // "Title: Subtitle (Parenthetical)" will be reduced to "Subtitle"
        // e.g., "Spell Effect: Ooze Form (Gelatinous Cube)" will become "Ooze Form"
        value.label = this.label.replace(/^[^:]+:\s*|\s*\([^)]+\)$/g, "");
        value.slug = this.data.slug;

        if (selector) {
            value.damageType &&= this.resolveInjectedProperties(value.damageType);
            const dice = new DamageDicePF2e(value as Required<DamageDiceRuleElementData>);
            const { damageDice } = this.actor.synthetics;
            damageDice[selector] = (damageDice[selector] || []).concat(dice);
        } else {
            console.warn("PF2E | Damage Dice requires a selector");
        }
    }
}

export interface DamageDiceRuleElement {
    data: DamageDiceRuleElementData;

    get actor(): CharacterPF2e | NPCPF2e;
}

interface DamageDiceRuleElementData extends RuleElementData {
    name?: string;
    damageType?: string;
    diceNumber?: number;
}
