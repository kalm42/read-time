import { describe, it, expect } from 'vitest';
import { getReadTime } from './index';
import fs from 'fs/promises';
import path from 'path';
import speeds from './languageSpeeds';

describe('getReadTime', () => {
	it('should return 0 when text is empty', () => {
		expect(getReadTime('', {})).toStrictEqual({
			milliseconds: 0,
			seconds: 0,
			minutes: 0,
			words: 0,
			text: '0 min read',
		});
	});

	it('should calculate read time correctly with default options', () => {
		const text = 'This is a sample text to read.';
		const options = {
			standardDeviationOffset: undefined,
			language: undefined,
			wordBound: undefined,
		};
		const expected = text.split(' ').length * (238 + 36 * 0);
		expect(getReadTime(text, options)).toStrictEqual({
			milliseconds: expected,
			seconds: expect.any(Number),
			minutes: expect.any(Number),
			words: 7,
			text: expect.any(String),
		});
	});

	it('should handle adjusting read speed', () => {
		const text = 'Another test case with different speed.';
		const options = {
			standardDeviationOffset: 1, // 1 standard deviation faster
			language: undefined,
			wordBound: undefined,
		};
		const expected = text.split(' ').length * (238 + 36 * 1);
		expect(getReadTime(text, options)).toStrictEqual({
			milliseconds: expected,
			seconds: expect.any(Number),
			minutes: expect.any(Number),
			words: 6,
			text: expect.any(String),
		});
	});

	it('should throw for null or undefined text', () => {
		// @ts-expect-error
		expect(() => getReadTime(null, {})).toThrow();
		// @ts-expect-error
		expect(() => getReadTime(undefined, {})).toThrow();
	});

	it('should throw an error if types are not followed', () => {
		// @ts-expect-error
		expect(() => getReadTime(12345, 'options')).toThrow();
	});
});

describe('Read Time Estimation', async () => {
	const data = await fs.readFile(
		path.join(__dirname, '../data/InfoRateData.json'),
		'utf-8'
	);
	const records = JSON.parse(data).slice(0, 15);
	const texts = {};
	for (let index = 0; index < records.length; index++) {
		const record = records[index];
		const filename = `${record.Text.toLowerCase()}_${record.Language.toLowerCase()}`;
		if (texts[filename]) return;

		const data = await fs.readFile(
			path.join(__dirname, `../data/texts/${filename}.txt`),
			'utf-8'
		);
		texts[filename] = data;
	}

	for (let index = 0; index < records.length; index++) {
		const record = records[index];
		const text =
			texts[`${record.Text.toLowerCase()}_${record.Language.toLowerCase()}`];

		it('should calculate read time correctly', () => {
			const result = getReadTime(text, {
				standardDeviationOffset: undefined,
				language: record.Language,
				wordBound: undefined,
			});
			const getLanguage = Intl.Segmenter.supportedLocalesOf(record.Language)[0];
			const sd = speeds[getLanguage];

			const howFastTheReaderActuallyDid = record.Duration * 1_000; // convert to milliseconds

			const slowestAcceptable =
				(sd.mean - sd.standardDeviation * 3) * result.words;
			const fastestAcceptable =
				(sd.mean + sd.standardDeviation * 3) * result.words;

			expect(howFastTheReaderActuallyDid).lessThanOrEqual(fastestAcceptable);
			expect(howFastTheReaderActuallyDid).greaterThanOrEqual(slowestAcceptable);
		});
	}

	it('should calculate read time correctly with HTML', () => {
		const html = `<p></p><h2>Indoor Air Quality Solutions Can Help Reduce VOCs</h2><p>With people spending more time indoors than ever before, there&apos;s a growing awareness of how indoor environments impact health and wellness. Exposure to volatile organic compounds (VOCs) is a prime concern, but what are they and how do they get into your home?</p><p>HVAC.com explains what homeowners need to know, from common sources of volatile organic compounds and how you can take control. Fortunately, there are effective ways to tackle VOCs and reduce your risk of exposure.</p><h2>What Are Volatile Organic Compounds?</h2><p><a href="https://www.epa.gov/indoor-air-quality-iaq/what-are-volatile-organic-compounds-vocs">Volatile organic compounds</a> are carbon-based chemicals that easily become gasses or vapors at room temperature. “Off-gassing” is a term you may have heard, which is the release of volatile organic compounds from certain materials and products. This process can last for days, months, or even years, depending on the product, and can contribute to indoor air pollution if not properly ventilated. </p><p>Off-gassing is a natural part of chemical breakdown, but excessive VOC buildup is a concern. Some VOCs are relatively harmless, but others can affect indoor air quality and potentially lead to health issues, especially with long-term exposure. The impact can vary depending on the VOC type, concentration, and exposure time.</p><h3>Common VOCs Found in Homes</h3><p>Many common household items emit VOCs. Some of the most common ones you might find in your home include:</p><ul><li>Formaldehyde</li><li>Benzene</li><li>Toluene</li><li>Xylene</li><li>Ethanol</li><li>Ethylene Glycol</li><li>Carbon Disulfide</li><li>Terpenes</li><li>Dichlorobenzene</li><li>Butanal</li></ul><h2>Sources of Volatile Organic Compounds in Your Home</h2><p>A surprising number of common household items and everyday products release VOCs into the air. Understanding where VOCs come from in your home is the first step toward reducing exposure and improving <a href="https://www.hvac.com/expert-advice/indoor-air-quality-guide/">indoor air quality</a>. The most common sources of volatile organic compounds in homes include:</p><h3>1. Household Cleaning Products</h3><p>Cleaning supplies are among the most significant sources of volatile organic compounds in homes. Products like bleach, glass cleaners, and disinfectants contain various chemicals that can release VOCs into the air during and after use.</p><h3>2. Air Fresheners</h3><p>Some air fresheners, scented candles, and deodorizers used in the home release VOCs. Some even do so when they’re not actively being used, as they gradually emit chemical fragrances.</p><h3>3. Paints and Finishes</h3><p>Whether you’re painting a wall, touching up furniture, or working on a DIY project, the products you use are likely sources of volatile organic compounds. Many paints and varnishes contain VOCs. Even after drying, they can continue to emit low levels of VOCs for years, especially when indoor air is stagnant.</p><h3>4. Building Materials and Furniture</h3><p>New furniture, flooring, and other building materials can be treated with adhesives, finishes, and other chemical coatings that contain VOCs. Pressed wood products may be treated with formaldehyde-based resins. Carpets, rugs, and upholstery are often treated with stain protectors that emit VOCs, too. If you’ve recently built a home, remodeled, or installed new furnishings, these products can continuously release VOCs over time.</p><h3>5. Personal Care Products</h3><p>Beauty and personal care products such as perfumes, hair sprays, deodorants, and lotions frequently contain VOCs. Fragrances often contain various VOCs that help products maintain a lasting scent. Sprays and aerosols release particles into the air, which can linger and spread.</p><h3>6. Fuel-Burning Appliances</h3><p>Any appliance that burns fuel – gas stoves, fireplaces, or <a href="https://www.hvac.com/expert-advice/how-does-a-furnace-work/">furnaces</a> – can be a source of VOCs. When fuel doesn’t burn completely, it releases VOCs like benzene and formaldehyde into the air. This is a greater risk if the appliances aren’t properly vented or maintained.</p><h3>7. Tobacco Smoke</h3><p>Secondhand smoke from cigarettes and other tobacco products is another significant source of VOCs. Even if smoking happens outside, residual smoke particles, known as thirdhand smoke, can enter the home through clothing, furniture, and walls. These particles carry VOCs such as benzene, formaldehyde, and other toxins.</p><h3>8. Office Supplies and Craft Materials</h3><p>If you work from home or engage in craft hobbies, office supplies and craft materials can be a hidden source of VOCs. Items like markers, glues, inks, and solvents all contain VOCs that can affect indoor air quality. Craft adhesives, for example, often contain toluene or xylene.</p><h2>How to Reduce VOCs in Your Home</h2><p>Discovering that your home may be filled with invisible chemicals released from everyday items can be alarming. With the potential to impact health over time, it’s important to take proactive steps to manage and reduce these compounds. The good news is that there are several effective ways to minimize the sources of volatile organic compounds in your home:</p><h3>Ventilation Is Key</h3><p>Newer homes are often tightly sealed to minimize energy loss – while this helps reduce heating and cooling costs, it can also trap more pollutants inside, including VOCs. You can improve airflow by adding a whole house ventilation system that brings in fresh outdoor air and pushes stale air outdoors to dilute VOC concentrations indoors. Open windows and doors when weather permits, and use exhaust fans in kitchens and bathrooms to help flush VOCs outside.</p><h3>Use an Air Purifier</h3><p><a href="https://www.hvac.com/expert-advice/how-do-uv-air-purifiers-work/">Whole home air purifiers</a> are integrated directly into your HVAC system to purify air across the entire home. As the air passes through the system, harmful gasses, odors, and particulates are removed, leaving the air cleaner and fresher. Units with HEPA filters and activated carbon filters are particularly effective at trapping VOC particles and other pollutants in the air.</p><h3>Regular HVAC Maintenance</h3><p>Scheduling <a href="https://www.hvac.com/expert-advice/guide-to-furnace-maintenance/">regular maintenance</a> for your HVAC system, changing filters, and keeping your system clean can help trap VOC particles and prevent them from recirculating in the air. Well-maintained gas heating systems are less likely to develop issues like gas leaks or poor airflow, both of which can cause elevated VOC levels. </p><h3>Install a Dehumidifier</h3><p>Although <a href="https://www.hvac.com/expert-advice/hvac-coms-guide-to-dehumidifiers-faqs-cost-benefits-brands-more/">dehumidifiers</a> do not remove VOCs directly, they help control humidity levels, which can indirectly reduce VOCs. Many VOCs are more likely to off-gas in high humidity environments. Whole home dehumidifiers work in conjunction with HVAC systems to maintain balanced humidity, creating a less hospitable environment for VOC off-gassing.</p><h3>Choose Low-VOC or VOC-Free Products</h3><p>Many household and building products now offer low-VOC or VOC-free options. These alternatives limit the number of VOCs released, making them safer for indoor use. Look for products certified by organizations like Green Seal or <a href="https://www.ul.com/insights/what-does-greenguard-certified-mean">GREENGUARD</a> to ensure they meet low-emission standards.</p><h3>Use Natural Alternatives</h3><p>Natural cleaners, candles, air fresheners, and fragrance-free personal care products are good choices to help reduce VOC exposure. Vinegar, baking soda, and essential oils make excellent, low-emission substitutes for many cleaning tasks.</p><h3>Store Products Properly</h3><p>Properly seal and store VOC-containing products like paints, solvents, and cleaning agents to help prevent unnecessary emissions. If possible, keep these items in a garage or shed rather than indoors.</p><h3>Let Materials Off-Gas Outdoors</h3><p>New furniture, carpets, paint, or building materials often emit strong VOCs when they are first unpacked or installed. To safely off-gas these items, place them outside in a well-ventilated area, such as a porch or garage, for a few days or until the strong chemical smell diminishes. This allows the harmful gasses to dissipate in an open space, rather than accumulating in your home.</p>`;
		// Word count from word: 1,172
		const result = getReadTime(html);
		// The extra 20 come from hyphenated words. I'm okay with this as it should result in a more accurate reading time considering they're read as two words.
		expect(result.words).toStrictEqual(1_172 + 20);
	});
});
