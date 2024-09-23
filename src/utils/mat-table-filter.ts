// NOT FROM ORIGINAL IMPLEMENTATION OF THIS FILTER FUNCTION
// Add this to replace characters with symbols with the normal version
const simplifyStringCharacters = (text: string) => {
  return (
    text
    // A
    .replaceAll('Á', 'A')
    .replaceAll('Ä', 'A')
    .replaceAll('Â', 'A')
    .replaceAll('á', 'a')
    .replaceAll('ä', 'a')
    .replaceAll('â', 'a')
    // E
    .replaceAll('É', 'E')
    .replaceAll('Ë', 'E')
    .replaceAll('È', 'E')
    .replaceAll('é', 'e')
    .replaceAll('ë', 'e')
    .replaceAll('ê', 'e')
    // I
    .replaceAll('Í', 'I')
    .replaceAll('Ï', 'I')
    .replaceAll('Î', 'I')
    .replaceAll('í', 'i')
    .replaceAll('ï', 'i')
    .replaceAll('î', 'i')
    // O
    .replaceAll('Ó', 'O')
    .replaceAll('Ö', 'O')
    .replaceAll('Ô', 'O')
    .replaceAll('ó', 'o')
    .replaceAll('ö', 'o')
    .replaceAll('ô', 'o')
    // U
    .replaceAll('Ú', 'U')
    .replaceAll('Ü', 'U')
    .replaceAll('Û', 'U')
    .replaceAll('ú', 'u')
    .replaceAll('ü', 'u')
    .replaceAll('û', 'u')
  )
}

export default function matTableFilter(data: object, filter: string) {
  // Transform the data into a lowercase string of all property values.
  const dataStr = Object.keys(data)
    .reduce((currentTerm, key) => {
        // Use an obscure Unicode character to delimit the words in the concatenated string.
        // This avoids matches where the values of two columns combined will match the user's query
        // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
        // that has a very low chance of being typed in by somebody in a text field. This one in
        // particular is "White up-pointing triangle with dot" from
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        return currentTerm + data[key] + '◬'
    }, '')
    .toLowerCase()

  // Transform the filter by converting it to lowercase and removing whitespace.
  const transformedFilter = simplifyStringCharacters(filter).trim().toLowerCase()
  return simplifyStringCharacters(dataStr).indexOf(transformedFilter) !== -1
}
