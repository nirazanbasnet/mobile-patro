export type ThemeMode = "light" | "dark" | "amoled" | "auto";

export interface ThemeColors {
	background: string;
	surface: string;
	surfaceElevated: string;
	text: string;
	textSecondary: string;
	textTertiary: string;
	accent: string;
	accentSecondary: string;
	dateGlow: string;
	border: string;
	cardBg: string;
	festivalHighlight: string;
	tabBar: string;
	tabBarBorder: string;
	tabBarInactive: string;
	statusBarStyle: "light" | "dark";
	modalOverlay: string;
}

export const lightTheme: ThemeColors = {
	background: "#FAFAF7",
	surface: "#FFFFFF",
	surfaceElevated: "#F5F3EF",
	text: "#1A1A2E",
	textSecondary: "#5C5C6F",
	textTertiary: "#9CA3AF",
	accent: "#FD3C54",
	accentSecondary: "#FD3C5420", // using lighter red instead of yellow
	dateGlow: "transparent",
	border: "#E8E5DE",
	cardBg: "#FFFFFF",
	festivalHighlight: "#FFF8E1",
	tabBar: "#FFFFFF",
	tabBarBorder: "#E8E5DE",
	tabBarInactive: "#9CA3AF",
	statusBarStyle: "dark",
	modalOverlay: "rgba(0,0,0,0.4)",
};

export const darkTheme: ThemeColors = {
	background: "#141620",
	surface: "#1E2035",
	surfaceElevated: "#282A42",
	text: "#F0EDE8",
	textSecondary: "#9CA3AF",
	textTertiary: "#6B7280",
	accent: "#FD3C54",
	accentSecondary: "#FD3C5430",
	dateGlow: "rgba(255, 107, 85, 0.15)",
	border: "#2D2F48",
	cardBg: "#1E2035",
	festivalHighlight: "#2D2520",
	tabBar: "#1A1C30",
	tabBarBorder: "#2D2F48",
	tabBarInactive: "#6B7280",
	statusBarStyle: "light",
	modalOverlay: "rgba(0,0,0,0.6)",
};

export const amoledTheme: ThemeColors = {
	background: "#000000",
	surface: "#0A0A0A",
	surfaceElevated: "#141414",
	text: "#FFFFFF",
	textSecondary: "#A0A0A0",
	textTertiary: "#666666",
	accent: "#FD3C54",
	accentSecondary: "#FD3C5440",
	dateGlow: "rgba(255, 107, 85, 0.2)",
	border: "#1A1A1A",
	cardBg: "#0A0A0A",
	festivalHighlight: "#1A1510",
	tabBar: "#000000",
	tabBarBorder: "#1A1A1A",
	tabBarInactive: "#555555",
	statusBarStyle: "light",
	modalOverlay: "rgba(0,0,0,0.7)",
};

export function getThemeColors(
	mode: ThemeMode,
	systemDark: boolean,
): ThemeColors {
	if (mode === "auto") {
		return systemDark ? darkTheme : lightTheme;
	}
	switch (mode) {
		case "dark":
			return darkTheme;
		case "amoled":
			return amoledTheme;
		default:
			return lightTheme;
	}
}
