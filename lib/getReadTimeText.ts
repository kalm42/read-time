const translations: { [key: string]: (min: number) => string } = {
	en: (minutes: number) => `${minutes} min read`,
	ca: (minutes: number) => `${minutes} min de lectura`,
	zh: (minutes: number) => `阅读时间约 ${minutes} 分钟`,
	de: (minutes: number) => `Lesezeit: ${minutes} Minuten`,
	eu: (minutes: number) => `${minutes} min irakurri`,
	fi: (minutes: number) => `Lukuaika: ${minutes} min`,
	fr: (minutes: number) => `Temps de lecture : ${minutes} min`,
	hu: (minutes: number) => `Olvasási idő: ${minutes} perc`,
	it: (minutes: number) => `Tempo di lettura: ${minutes} minuti`,
	ja: (minutes: number) => `読み時間：約${minutes}分`,
	default: (minutes: number) => `${minutes} min read`,
};
export function getReadTimeText(minutes: number, language: string) {
	const translation = translations[language] || translations.default;
	return translation(minutes);
}
