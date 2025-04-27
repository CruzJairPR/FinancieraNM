import { Typography as MuiTypography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const H1 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const H2 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const H3 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const H4 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const H5 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const H6 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const Subtitle1 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: 1.5,
}));

export const Subtitle2 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: 1.5,
}));

export const Body1 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 400,
  lineHeight: 1.5,
}));

export const Body2 = styled(MuiTypography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 400,
  lineHeight: 1.5,
}));

export const Caption = styled(MuiTypography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 400,
  lineHeight: 1.5,
}));

export const Overline = styled(MuiTypography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  lineHeight: 1.5,
  textTransform: "uppercase",
}));

export const Typography = (props: TypographyProps) => {
  return <MuiTypography {...props} />;
};
