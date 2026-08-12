const VALID_MATERIAL_ICONS = new Set([
  "dentistry",
  "clean_hands",
  "mood",
  "notification_important",
  "medical_services",
  "healing",
  "health_and_safety",
  "biotech",
  "monitor_heart",
  "stethoscope",
  "medication",
  "clinical_notes",
  "arrow_forward",
  "arrow_back",
  "expand_more",
  "calendar_month",
  "calendar_today",
  "menu",
  "close",
  "chevron_left",
  "chevron_right",
  "check",
  "auto_awesome",
  "child_care",
  "person",
  "favorite",
  "inventory_2",
])

export function safeMaterialIcon(name: string | null | undefined): string {
  return name && VALID_MATERIAL_ICONS.has(name) ? name : "medical_services"
}
