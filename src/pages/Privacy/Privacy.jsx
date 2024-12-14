// import { Box, Typography } from "@mui/material";
// import "./privacy.css";

// const Privacy = () => {
// 	return (
// 		<Box className="privacy-container">
// 			<Typography variant="h3" className="privacy-title">
// 				Privacy Policy
// 			</Typography>
// 			<Typography variant="body1" className="last-updated">
// 				Last updated: November 25, 2024
// 			</Typography>

// 			<section className="privacy-section">
// 				<Typography variant="h5">1. Information We Collect</Typography>
// 				<Typography variant="body1">
// 					When you use Quizitude, we collect the following types of information:
// 					<ul>
// 						<li>Account information (email, name)</li>
// 						<li>Study data (flashcards, decks, categories)</li>
// 						<li>Usage statistics (study sessions, performance metrics)</li>
// 					</ul>
// 				</Typography>
// 			</section>

// 			<section className="privacy-section">
// 				<Typography variant="h5">2. How We Use Your Information</Typography>
// 				<Typography variant="body1">
// 					We use your information to:
// 					<ul>
// 						<li>Provide and improve our flashcard study services</li>
// 						<li>Personalize your learning experience</li>
// 						<li>Generate statistics</li>
// 						<li>Send important updates about your account</li>
// 					</ul>
// 				</Typography>
// 			</section>

// 			<section className="privacy-section">
// 				<Typography variant="h5">3. Data Storage and Security</Typography>
// 				<Typography variant="body1">
// 					Your flashcards and study data are stored securely in our database. We
// 					implement appropriate security measures to protect your information
// 					from unauthorized access, alteration, or disclosure.
// 				</Typography>
// 			</section>

// 			<section className="privacy-section">
// 				<Typography variant="h5">4. Your Rights</Typography>
// 				<Typography variant="body1">
// 					You have the right to:
// 					<ul>
// 						<li>Access your personal data</li>
// 						<li>Correct inaccurate data</li>
// 						<li>Delete your account and associated data</li>
// 						{/* <li>Export your flashcards and study materials</li> */}
// 					</ul>
// 				</Typography>
// 			</section>

// 			<section className="privacy-section">
// 				<Typography variant="h5">5. Contact Us</Typography>
// 				<Typography variant="body1">
// 					If you have any questions about this Privacy Policy, please contact us
// 					at: <a href="mailto:hello@firstiq.tech">hello@firstiq.tech</a>
// 				</Typography>
// 			</section>
// 		</Box>
// 	);
// };

// export default Privacy;
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import "./privacy.css";

const Privacy = () => {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const PrivacyContent = () => (
		<>
			<Typography variant="h3" className="privacy-title">
				Privacy Policy
			</Typography>
			<Typography variant="body1" className="last-updated">
				Last updated: November 25, 2024
			</Typography>

			{/* Existing privacy sections */}
			<section className="privacy-section">
				<Typography variant="h5">1. Information We Collect</Typography>
				<Typography variant="body1">
					When you use Quizitude, we collect the following types of information:
					<ul>
						<li>Account information (email, name)</li>
						<li>Study data (flashcards, decks, categories)</li>
						<li>Usage statistics (study sessions, performance metrics)</li>
					</ul>
				</Typography>
			</section>
			<section className="privacy-section">
				<Typography variant="h5">2. How We Use Your Information</Typography>
				<Typography variant="body1">
					We use your information to:
					<ul>
						<li>Provide and improve our flashcard study services</li>
						<li>Personalize your learning experience</li>
						<li>Generate statistics</li>
						<li>Send important updates about your account</li>
					</ul>
				</Typography>
			</section>
			<section className="privacy-section">
				<Typography variant="h5">3. Data Storage and Security</Typography>
				<Typography variant="body1">
					Your flashcards and study data are stored securely in our database. We
					implement appropriate security measures to protect your information
					from unauthorized access, alteration, or disclosure.
				</Typography>
			</section>

			<section className="privacy-section">
				<Typography variant="h5">4. Your Rights</Typography>
				<Typography variant="body1">
					You have the right to:
					<ul>
						<li>Access your personal data</li>
						<li>Correct inaccurate data</li>
						<li>Delete your account and associated data</li>
						{/* <li>Export your flashcards and study materials</li> */}
					</ul>
				</Typography>
			</section>

			<section className="privacy-section">
				<Typography variant="h5">5. Contact Us</Typography>
				<Typography variant="body1">
					If you have any questions about this Privacy Policy, please contact us
					at: <a href="mailto:hello@firstiq.tech">hello@firstiq.tech</a>
				</Typography>
			</section>
			{/* ... other privacy sections ... */}
		</>
	);

	const TermsContent = () => (
		<>
			<Typography variant="h3" className="privacy-title">
				Terms & Conditions
			</Typography>
			<Typography variant="body1" className="last-updated">
				Last updated: November 25, 2024
			</Typography>

			<section className="privacy-section">
				<Typography variant="h5">1. Acceptance of Terms</Typography>
				<Typography variant="body1">
					By accessing and using Quizitude, you agree to be bound by these Terms
					and Conditions. If you do not agree to these terms, please do not use
					our service.
				</Typography>
			</section>

			<section className="privacy-section">
				<Typography variant="h5">2. User Accounts</Typography>
				<Typography variant="body1">
					<ul>
						<li>You must be at least 16 years old to use this service</li>
						<li>
							You are responsible for maintaining the security of your account
						</li>
						<li>
							You agree not to share copyrighted content without permission
						</li>
					</ul>
				</Typography>
			</section>

			<section className="privacy-section">
				<Typography variant="h5">3. Content Guidelines</Typography>
				<Typography variant="body1">
					When creating and sharing flashcards:
					<ul>
						<li>You retain ownership of your content</li>
						<li>You grant us license to use and display your content</li>
						<li>Content must not violate any applicable laws</li>
						<li>We reserve the right to remove inappropriate content</li>
					</ul>
				</Typography>
			</section>
		</>
	);

	return (
		<Box className="privacy-container">
			<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					sx={{
						"& .MuiTab-root": {
							fontFamily: "Inter",
							fontWeight: 600,
							color: "rgba(102, 112, 133, 1)",
							"&.Mui-selected": {
								color: "#3538cd",
							},
						},
						"& .MuiTabs-indicator": {
							backgroundColor: "#3538cd",
						},
					}}
				>
					<Tab label="Privacy Policy" />
					<Tab label="Terms & Conditions" />
				</Tabs>
			</Box>

			{tabValue === 0 && <PrivacyContent />}
			{tabValue === 1 && <TermsContent />}
		</Box>
	);
};

export default Privacy;
