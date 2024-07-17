/** @type {import('next').NextConfig} */
const nextConfig = {
	redirects() {
		return [
			process.env.MAINTENANCE_MODE === 'true' ? { source: "/((?!maintenance).*)", destination: "/maintenance", permanent: false } : null,
			process.env.MAINTENANCE_MODE === 'false' ? { source: "/maintenance", destination: "/", permanent: false } : null,
		].filter(Boolean)
	},
}

module.exports = nextConfig
