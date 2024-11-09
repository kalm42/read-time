const translations = {
	en: (minutes) => `${minutes} min read`,
	ca: (minutes) => `${minutes} min de lectura`,
	zh: (minutes) => `阅读时间约 ${minutes} 分钟`,
	de: (minutes) => `Lesezeit: ${minutes} Minuten`,
	eu: (minutes) => `${minutes} min irakurri`,
	fi: (minutes) => `Lukuaika: ${minutes} min`,
	fr: (minutes) => `Temps de lecture : ${minutes} min`,
	hu: (minutes) => `Olvasási idő: ${minutes} perc`,
	it: (minutes) => `Tempo di lettura: ${minutes} minuti`,
	ja: (minutes) => `読み時間：約${minutes}分`,
	default: (minutes) => `${minutes} min read`,
};
export function getReadTimeText(minutes, language) {
	const translation = translations[language] || translations.default;
	return translation(minutes);
}
