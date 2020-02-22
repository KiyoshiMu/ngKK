import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
// import * as path from 'path';
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
interface Email {
	doctorEmail: string,
	doctorName: string,
	patientName: string,
	verifyLink: string,
	extra: string,
}

admin.initializeApp();
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'kennythekidneymsg@gmail.com',
		pass: 'myq722150'
	}
});

function sendEmail(
	{ doctorEmail,
		doctorName,
		patientName,
		verifyLink,
		extra }: Email
) {
	const mailOptions = {
		from: 'Kenny the Kidney <kennythekidneymsg@gmail.com>',
		to: doctorEmail,
		subject: 'DoNotReply-PatientVerification',
		html: fs.readFileSync('verify.html', 'utf8')
			.replace('${doctorName}', doctorName)
			.replace('${patientName}', patientName)
			.replace('${verifyLink}', verifyLink)
			.replace('${extra}', extra)
	};

	// returning result
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error.toString());
		}
		console.log('Sended');
	});
};

exports.verifyPatient = functions.https.onRequest(async (req, res) => {
	const uid = req.query.uid;
	const updateResult = await admin.firestore().doc(`users/${uid}`).update(
		{ 'doctorVerified': true }
	)
	if (updateResult) {
		res.send(
			fs.readFileSync('notify.html', 'utf8')
				.replace('${content}',
					'You will get notification when your patient is in risk eGRF'
				)
				.replace('${comment}',
					"This is to confirm your verification."
				)
				.replace('${src}',
					'https://i.ibb.co/6rJDCY3/confirm.png')
		);

		const patientProfile = (await admin.firestore().doc(`users/${uid}`).get()).data();
		if (patientProfile) {
			const content = `Hi ${patientProfile.firstName}, your doctor ${patientProfile.doctorName} has <strong>successfully</strong> verified your request.
			`;
			const comment = "This email is to notify your doctor's verification.";
			const mailOptions = {
				from: 'Kenny the Kidney <kennythekidneymsg@gmail.com>',
				to: patientProfile.email,
				subject: 'DoNotReply-DoctorVerification',
				html: fs.readFileSync('notify.html', 'utf8')
					.replace('${content}', content)
					.replace('${comment}', comment)
					.replace('${src}', 'https://i.ibb.co/6rJDCY3/confirm.png')
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error.toString());
				}
				console.log('Sended');
			});
		}
	}
	else {
		res.status(500).send({ error: 'something blew up' })
	}
});

exports.monitorWrite = functions.firestore
	.document('doctors/{userId}')
	.onCreate(async (snapshot, context) => {
		const ref = await snapshot.ref.get();
		const data = ref.data();
		const link = `https://us-central1-predmeal.cloudfunctions.net/verifyPatient?uid=${context.params.userId}`;
		if (data) {
			sendEmail(
				{
					doctorEmail: data.doctorEmail,
					doctorName: data.doctorName,
					verifyLink: link,
					patientName: data.patientName,
					extra: data.message ? `The message from ${data.patientName} is ${data.message}` : ''
				}
			)
		}
	});

exports.notifyDoctor = functions.https.onRequest(async (req, res) => {
	const labels = [
		'Kidney function moderately to severely decreased',
		'Kidney function severely decreased',
		'Kidney failure'
	]
	const idx = req.query.idx;
	const uid = req.query.uid;
	const renderData = await dataRender(uid);
	const patientProfile = (await admin.firestore().doc(`users/${uid}`).get()).data();
	if (patientProfile) {
		const content = `Hi Dr.${patientProfile.doctorName}, your patient ${patientProfile.firstName}'s 
		recent eGFR shows this patient has <strong>${labels[idx]}</strong>. 
		<a href='${renderData.chartSrc}'>See Chart</a> with the eGFR records attached	  
		`;
		const comment = "This email is to notify your patient's risk condition.";
		const mailOptions = {
			from: 'Kenny the Kidney <kennythekidneymsg@gmail.com>',
			to: patientProfile.doctorEmail,
			subject: 'DoNotReply-PatientRiskCondition',
			html: fs.readFileSync('notify.html', 'utf8')
				.replace('${content}', content)
				.replace('${comment}', comment)
				.replace('${src}', 'https://i.ibb.co/8N5bWZn/sad.png'),
			attachments: [
				{   // utf-8 string as an attachment
					filename: `${patientProfile.firstName}.csv`,
					content: renderData.csvContent,
				}],
		};

		// returning result
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error.toString());
				res.json({ error: error.toString() })
			}
			console.log('Sended');
			res.json({ status: 'Sended' })
		});
	}
	else {
		res.json({ status: 'cannot find patientProfile' })
	}
})

async function dataRender(uid: string) {
	const docs = await admin.firestore()
		.collection('egfrRecords')
		.where("uid", "==", uid)
		.orderBy("time")
		.limit(30)
		.get();
	const csvContent = ['time,eGFR'];
	const labels: string[] = [];
	const data: number[] = [];
	docs.forEach(doc => {
		const data_ = doc.data();
		const time = new Date(data_.time).toLocaleString()
		labels.push(time);
		data.push(data_.egfr);
		csvContent.push(`${time},${data_.egfr}`)
	})
	const c = JSON.stringify({
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'eGFR', data: data,
				backgroundColor: 'rgba(225, 225, 225, 1)'
			}]
		}
	})

	const chartSrc = `https://quickchart.io/chart?c=${c}`;
	console.log('docs', chartSrc)
	return {
		chartSrc: chartSrc,
		csvContent: csvContent.join('\n')
	}
}

// sendEmail({
// 	'doctorEmail': 'mooyewtsing@gmail.com',
// 	'doctorName': 'moo',
// 	'patientName': 'mu',
// 	'extra': 'hi',
// 	'verifyLink': 'https://google.com'
// })