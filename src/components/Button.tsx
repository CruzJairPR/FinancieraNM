import { Button as MuiButton, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PrimaryButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: 4,
  fontWeight: 500,
  fontSize: "16px",
  padding: "8px 16px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const SecondaryButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 4,
  fontWeight: 500,
  fontSize: "16px",
  padding: "8px 16px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(196, 30, 58, 0.04)",
    borderColor: theme.palette.primary.dark,
  },
}));

export const TextButton = styled(MuiButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: "8px 16px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(196, 30, 58, 0.04)",
  },
}));

export const Button = (props: ButtonProps) => {
  return <MuiButton {...props} />;
};
