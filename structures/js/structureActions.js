/* =========================
    Gebäude – Aktionen (UI-Anbindung)
    Bauprojekte werden manuell gestartet und laufen über die zentrale Wirtschaft.
    Es gibt keine Warteschlange: ein belegter Bauplatz bleibt nach Abschluss leer.
========================= */

function startStructureProject(structureId, kind, targetLevel)
{
    const result = Economy.startProject(structureId, kind, targetLevel);

    if (!result.ok)
    {
        updateStatus(result.reason.key || "status.elite.cannotAfford", "warning", false, result.reason.params || null);
        return false;
    }

    updateStatus("status.build.started", "status", false, {
        structure: { key: StructureRegistry.get(structureId).nameKey },
        time: formatDuration(result.durationSeconds)
    });

    updateResources();
    return true;
}

function startStructureProjectBatch(id, amount)
{
    const options = Economy.getProjectBatchOptions(id), quantity = amount === "max" ? options.max : amount;
    if (amount === "max" && quantity < 26) return false;
    const result = Economy.queueProjectBatch(id, quantity);
    if (!result.ok) { updateStatus(result.reason.key || "status.elite.cannotAfford", "warning"); return false; }
    updateStatus("status.build.queued", "status", false, { count: quantity, structure: { key: StructureRegistry.get(id).nameKey } });
    updateResources();
    if (typeof CardBuilder !== "undefined") CardBuilder.updateAll();
    return true;
}

const STRUCTURE_PROGRESS_BARS = {
    "housing-chamber": { build: "progress-housing", upgrade: "progress-housing-upgrade" },
    "mushroom-farm": { build: "progress-mushroom" },
    "storage-room": { build: "progress-storage" },
    "brood-chamber": { build: "progress-nursery" },
    "construction-chamber": { build: "progress-construction" }
};

function updateConstructionProgressUI()
{
    Object.keys(STRUCTURE_PROGRESS_BARS).forEach(structureId =>
    {
        Object.keys(STRUCTURE_PROGRESS_BARS[structureId]).forEach(kind =>
        {
            const bar = document.getElementById(STRUCTURE_PROGRESS_BARS[structureId][kind]);

            if (bar)
            {
                bar.style.width = `${(Economy.getProjectProgress(structureId, kind) * 100).toFixed(1)}%`;
            }
        });
    });
}
