import { createTheme } from '@mui/material/styles';

// Uma paleta de sombras subtis para um visual mais limpo e moderno
const shadows = [
  'none',
  '0px 2px 4px -1px rgba(0,0,0,0.06), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.02)',
  ...Array(23).fill('0px 8px 24px -4px rgba(0,0,0,0.08)'),
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#00897b', // Verde-azulado (teal) LINDO 
      light: '#4ebaaa',
      dark: '#005b4f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057', // Rosa vibrante para ações de destaque
    },
    error: {
      main: '#d32f2f', // Vermelho padrão para erros
    },
    warning: {
      main: '#ed6c02', // Laranja para avisos
    },
    success: {
      main: '#2e7d32', // Verde para sucesso
    },
    background: {
      default: '#f4f6f8', // Um fundo de cinza muito claro e neutro
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2027', // Preto um pouco mais suave
      secondary: '#6c757d',
    },
    divider: 'rgba(0, 0, 0, 0.08)', // Cor para divisórias
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontSize: '1rem', color: '#6c757d' },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.5px' },
  },

  shape: {
    borderRadius: 12,
  },

  shadows, 

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ffffff', // AppBar 
          color: '#1a2027',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: shadows[1],
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: shadows[4],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 22px',
        },
        containedPrimary: {
            '&:hover': {
                backgroundColor: '#00695f',
            }
        }
      },
    },
    MuiTableCell: {
        styleOverrides: {
            head: {
                fontWeight: 600,
                color: '#6c757d',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            },
            body: {
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            }
        }
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:last-child td, &:last-child th': {
                    border: 0,
                },
            },
        },
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: '#1a2027',
                borderRadius: 8,
                fontSize: '0.8rem',
            },
            arrow: {
                color: '#1a2027',
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            }
        }
    }
  },
});

export default theme;