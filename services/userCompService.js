module.exports.alphabeticalCompareOnNom = function (a, b) { // Alphabetical compare on 'nom' field
	if (a.nom > b.nom) {
		return 1;
	}
	if (a.nom < b.nom) {
		return -1;
	}
	return 0;
}