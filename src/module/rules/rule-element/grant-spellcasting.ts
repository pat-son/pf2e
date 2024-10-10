import type { ActorType } from "@actor";
import type { StringField } from "types/foundry/common/data/fields.d.ts";
import type { ModelPropsFromRESchema, RuleElementSchema } from "./data.ts";
import { RuleElementPF2e } from "./base.ts";
import { SpellcastingEntryPF2e } from "@item";

class GrantSpellcastingRuleElement extends RuleElementPF2e<GrantSpellcastingSchema> {
    static override validActorTypes: ActorType[] = ["character"];

    static override defineSchema(): GrantSpellcastingSchema {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            ability: new fields.StringField({
                required: true,
                nullable: false,
                blank: false,
                choices: ["cha", "int", "wis"],
            }),
            type: new fields.StringField({
                required: true,
                nullable: false,
                blank: false,
                choices: ["innate", "focus", "prepared", "spontaneous"],
            }),
            proficiency: new fields.StringField({
                required: false,
                nullable: false,
                blank: true,
                initial: "",
            }),
            tradition: new fields.StringField({
                required: true,
                nullable: false,
                blank: false,
                choices: ["arcane", "divine", "occult", "primal"],
            }),
        };
    }

    override preCreate(args: RuleElementPF2e.PreCreateParams): Promise<void> {
        console.log("GrantSpellcasting preCreate", args);
        const spellcastingTemplate = new SpellcastingEntryPF2e(
            {
                name: "Granted Spellcasting",
                type: "spellcastingEntry",
                system: {
                    ability: { value: this.ability },
                    tradition: { value: this.tradition },
                    prepared: { value: this.type },
                    proficiency: { value: 1, slug: this.proficiency ?? "" },
                },
            },
            { parent: this.actor },
        );

        args.pendingItems.push(spellcastingTemplate.toObject());

        return Promise.resolve();
    }
}

type GrantSpellcastingSchema = RuleElementSchema & {
    /**
     * Ability score used with these spells
     */
    ability: StringField<string, string, true, false, false>;
    /**
     * Spellcasting Type (prepared, spontaneous, focus, or innate)
     */
    type: StringField<string, string, true, false, false>;
    /**
     * Proficiency to use for the spellcasting, or blank if regular spellcasting
     */
    proficiency: StringField<string, string, false, false, true>;
    /**
     * Magical tradition for the spells
     */
    tradition: StringField<string, string, true, false, false>;
};

interface GrantSpellcastingRuleElement
    extends RuleElementPF2e<GrantSpellcastingSchema>,
        ModelPropsFromRESchema<GrantSpellcastingSchema> {}

export { GrantSpellcastingRuleElement };
