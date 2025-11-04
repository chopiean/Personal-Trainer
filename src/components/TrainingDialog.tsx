import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Training = {
  date: string;
  activity: string;
  duration: number;
  customer: string | { firstname: string; lastname: string } | null;
  customerHref?: string;
};

type Customer = {
  firstname: string;
  lastname: string;
  _links: { self: { href: string } };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (t: Training) => void;
  training?: Training;
};

export default function TrainingDialog({
  open,
  onClose,
  onSave,
  training,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [trainingData, setTrainingData] = useState<Training>({
    date: dayjs().toISOString(),
    activity: "",
    duration: 60,
    customer: "",
  });

  useEffect(() => {
    fetch(
      "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers"
    )
      .then((res) => res.json())
      .then((data) => setCustomers(data._embedded?.customers ?? []))
      .catch((err) => console.error("Customer fetch error:", err));
  }, []);

  useEffect(() => {
    if (!training) {
      setTrainingData({
        date: dayjs().toISOString(),
        activity: "",
        duration: 60,
        customer: "",
        customerHref: "",
      });
      setCustomerName("");
      return;
    }

    const customerObj =
      typeof training.customer === "object" && training.customer
        ? training.customer
        : null;

    setTrainingData({
      date: training.date,
      activity: training.activity,
      duration: training.duration,
      customer: customerObj || training.customer,
      customerHref: training.customerHref || "",
    });

    if (customerObj) {
      const first = customerObj.firstname || "";
      const last = customerObj.lastname || "";
      const fullName = `${first} ${last}`.trim();
      console.log("✅ Setting customer name in dialog:", fullName);
      setCustomerName(fullName);
    } else {
      console.warn("⚠️ No customer object found in training:", training);
      setCustomerName("");
    }
  }, [training]);

  const handleSave = () => {
    if (!trainingData.activity.trim()) {
      alert("Please enter activity.");
      return;
    }
    if (!training && typeof trainingData.customer !== "string") {
      alert("Please select a customer.");
      return;
    }
    onSave(trainingData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#121212",
          color: "white",
          minWidth: 420,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "#00e676" }}>
        {training ? "Edit Training" : "Add Training"}
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#121212" }}>
        <Stack spacing={2} mt={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider
              theme={createTheme({
                palette: {
                  mode: "dark",
                  primary: { main: "#00e676" },
                },
                components: {
                  MuiSvgIcon: {
                    styleOverrides: {
                      root: { color: "#00e676" },
                    },
                  },
                  MuiOutlinedInput: {
                    styleOverrides: {
                      root: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2a2a2a",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#00e676",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#00e676",
                          boxShadow: "0 0 6px rgba(0, 230, 118, 0.4)",
                        },
                        "& input": { color: "white" },
                        "& .MuiSvgIcon-root": { color: "#00e676" },
                      },
                    },
                  },
                  ...{
                    MuiPickersDay: {
                      styleOverrides: {
                        root: {
                          "&.Mui-selected": {
                            backgroundColor: "#00e676",
                            color: "#000",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(0,230,118,0.3)",
                          },
                        },
                      },
                    },
                  },
                },
              })}
            >
              <DateTimePicker
                label="Date & Time"
                value={dayjs(trainingData.date)}
                onChange={(newVal) =>
                  setTrainingData({
                    ...trainingData,
                    date: newVal?.toISOString() ?? trainingData.date,
                  })
                }
                format="DD/MM/YYYY HH:mm"
                ampm={false}
                enableAccessibleFieldDOMStructure={false}
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
            </ThemeProvider>
          </LocalizationProvider>

          <TextField
            label="Activity"
            value={trainingData.activity}
            onChange={(e) =>
              setTrainingData({ ...trainingData, activity: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Duration (minutes)"
            type="number"
            value={trainingData.duration}
            onChange={(e) =>
              setTrainingData({
                ...trainingData,
                duration: Number(e.target.value),
              })
            }
            fullWidth
          />

          <FormControl fullWidth variant="outlined">
            {!training && (
              <InputLabel
                id="customer-label"
                sx={{
                  color: "white",
                  "&.Mui-focused": { color: "white" },
                }}
              >
                Customer
              </InputLabel>
            )}

            {training ? (
              //Edit mode
              <TextField
                key={customerName}
                value={customerName || ""}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": {
                    borderColor: "#2a2a2a",
                  },
                  "&:hover fieldset": { borderColor: "#00e676" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00e676",
                    boxShadow: "0 0 6px rgba(0, 230, 118, 0.4)",
                  },
                  "& input": { color: "white" },
                }}
              />
            ) : (
              //Add mode
              <Select
                labelId="customer-label"
                label="Customer"
                value={
                  typeof trainingData.customer === "string"
                    ? trainingData.customer
                    : ""
                }
                onChange={(e) =>
                  setTrainingData({ ...trainingData, customer: e.target.value })
                }
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2a2a2a",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00e676",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00e676",
                    boxShadow: "0 0 6px rgba(0, 230, 118, 0.4)",
                  },
                  "& .MuiSvgIcon-root": { color: "#00e676" },
                }}
              >
                {customers.map((c) => (
                  <MenuItem key={c._links.self.href} value={c._links.self.href}>
                    {c.firstname} {c.lastname}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#121212",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{ color: "white", "&:hover": { color: "#00e676" } }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#00e676",
            color: "#000",
            "&:hover": { backgroundColor: "#00c267" },
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
