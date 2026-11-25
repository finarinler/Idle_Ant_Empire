/* =========================
    Registries für Einheiten und Gebäude
    Jede Einheit / jedes Gebäude liegt in einer eigenen Definitionsdatei
    (units/js/definitions, structures/js/definitions) und registriert sich hier.
    Definitionen enthalten NUR Konfiguration und Profile. Sie verändern niemals
    selbst Ressourcenbestände (das tut ausschließlich die zentrale Wirtschaft).
========================= */

function createRegistry(label, requiredFields)
{
    const entries = new Map();

    return {
        register(definition)
        {
            if (!definition || typeof definition.id !== "string")
            {
                throw new Error(`[${label}] Definition ohne id.`);
            }

            requiredFields.forEach(field =>
            {
                if (!(field in definition))
                {
                    throw new Error(`[${label}] Definition "${definition.id}" fehlt Feld "${field}".`);
                }
            });

            if (entries.has(definition.id))
            {
                throw new Error(`[${label}] "${definition.id}" ist bereits registriert.`);
            }

            entries.set(definition.id, definition);
            return definition;
        },

        get(id)
        {
            const definition = entries.get(id);

            if (!definition)
            {
                throw new Error(`[${label}] Unbekannte id "${id}".`);
            }

            return definition;
        },

        has(id) { return entries.has(id); },
        all() { return Array.from(entries.values()); },
        unregister(id) { entries.delete(id); }
    };
}

const UnitRegistry = createRegistry("UnitRegistry", ["nameKey", "store"]);
const StructureRegistry = createRegistry("StructureRegistry", ["nameKey", "store"]);
