/* =========================
    Königin (Definition)
    Produziert 0,1 Larven/s und verbraucht 0,5 Nahrung/s (Überlebensressource).
    Die Larvenproduktion skaliert mit der Effizienz (keine Alles-oder-nichts-Produktion mehr).
    Wohnraum: 2.
========================= */

function getCurrentQueenFoodCost()
{
    const config = BALANCE.carriedOver.queen;

    return Big(config.baseFood).mul(Big(config.foodScaling).pow(GameState.resources.queens));
}

function getCurrentQueenAntCost()
{
    const config = BALANCE.carriedOver.queen;

    return Big(config.baseAnts).mul(Big(config.antsScaling).pow(GameState.resources.queens)).ceil();
}

UnitRegistry.register({
    id: "queen",
    nameKey: "unit.queen.name",
    store: { kind: "resource", key: "queens" },
    housing: 2,

    consumption: [{ resource: "food", rate: BALANCE.upkeep["queen"], kind: "survival" }],
    production: [{ resource: "larvae", rate: BALANCE.larvaeProductionPerQueen }],
    refund: { food: BALANCE.refunds["queen"] },

    recruit: {
        getCost: () => ({ ants: getCurrentQueenAntCost(), food: getCurrentQueenFoodCost() }),
        announce: false
    }
});
