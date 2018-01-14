export default function filterUnsuppressed(items) {
  return items.filter(item => !item.suppress);
}
