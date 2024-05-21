import { google } from "googleapis";

type TransformedValue = {
	name: string;
	id: string;
	color: string;
	grade: string;
	setter: string;
	comment: string;
	date: string;
	link: string;
};

const keys = {
	type: process.env.TYPE,
	project_id: process.env.PROJECT_ID,
	private_key_id: process.env.PRIVATE_KEY_ID,
	private_key: process.env.PRIVATE_KEY,
	client_email: process.env.CLIENT_EMAIL,
	client_id: process.env.CLIENT_ID,
	auth_uri: process.env.AUTH_URI,
	token_uri: process.env.TOKEN_URI,
	auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
	client_x509_cert_url: process.env.CLIENT,
	universe_domain: process.env.UNIVERSE_DOMAIN,
};

function convertToISODate(dateString: string): string {
	const [day, month, year] = dateString.split("/");
	if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
		throw new Error("Invalid date format");
	}

	let adjustedYear = parseInt(year, 10);
	if (adjustedYear < 100) {
		adjustedYear += 2000;
	}

	const date = new Date(adjustedYear, parseInt(month) - 1, parseInt(day));

	const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
	const adjustedDate = new Date(date.getTime() - timezoneOffset);

	const isoDate = adjustedDate.toISOString();
	return isoDate;
}

function transformData(data: any[][]): { transformedValues: TransformedValue[], routeNum: number } {
	const colorReplacements: { [key: string]: string } = {
		R: "red",
		G: "green",
		BL: "blue",
		Y: "yellow",
		PI: "pink",
		PR: "purple",
		BK: "black",
		O: "orange",
		W: "white",
	};
	const transformedValues: TransformedValue[] = data
		.map((row: any[]) => {
			const link = row[7] || "";
			if (!row[2]) return null;
			const color = colorReplacements[row[2]] || row[2];
			return {
				name: row[0], // Directly assign the first row's name
				id: row[1],
				color: color,
				grade: row[3],
				setter: row[4].toLowerCase(),
				comment: row[5],
				date: convertToISODate(row[6]),
				link: link,
			};
		})
		.filter((item): item is TransformedValue => item !== null);

	return {
		transformedValues,
		routeNum: transformedValues.length,
	};
}



const spreadSheetId = process.env.SHEET_ID;

const client = new google.auth.JWT(keys.client_email, undefined, keys.private_key, [
	"https://www.googleapis.com/auth/spreadsheets",
]);
client.authorize(function (err, tokens) {
	if (err) {
		console.log(err);
		return;
	} else {
		console.log("Authorized successfully");
	}
});

export default defineEventHandler(async (event) => {
	try {
		const gsapi = google.sheets({ version: "v4", auth: client });

		const opt = {
			spreadsheetId: spreadSheetId,
			range: "Sheet1!B3:I137",
		};

		const data = await gsapi.spreadsheets.values.get(opt);
		if (!data || !data.data || !data.data.values) {
			throw new Error("Failed to fetch data from Google Sheets");
		}

		const transformedData = transformData(data.data.values);
		return {
			statusCode: 200,
			body: JSON.stringify(transformedData),
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Internal Server Error" }),
		};
	}
});
