import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import Calendar from "react-calendar"; // Use react-calendar for date selection
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import { environment } from "../../environment"; // Import environment for API URL
import "./Holidays.css"; // Custom styles for holidays
import DeleteIcon from "@mui/icons-material/Delete";

const Holidays = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Month is 0-indexed
  const [holidays, setHolidays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date()); // Synchronize calendar

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");

  // Fetch holidays based on the selected year and month
  const fetchHolidays = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${environment.apiUrl}/holidays/holidays/${year}/${month}`,
        { headers }
      );
      if (response.data) {
        const localHolidays = response.data.map((holiday) => ({
          ...holiday,
          date: new Date(holiday.date).toISOString().split("T")[0], // Convert to local date (YYYY-MM-DD)
        }));
        setHolidays(localHolidays);
      } else {
        Swal.fire("Error", "Failed to fetch holidays", "error");
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [year, month]); // Fetch holidays when year or month changes

  // Handle changes in the year input box
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setYear(newYear);

    // Update the calendar value when the year changes
    setCalendarValue(new Date(newYear, month - 1)); // Keep the current month
  };

  // Handle changes in the month input box
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);

    // Update the calendar value when the month changes
    setCalendarValue(new Date(year, newMonth - 1)); // Keep the current year
  };

  const handleDateChange = (date) => {
    // Format the date as YYYY-MM-DD (in local time zone)
    const localDateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    // Toggle date selection (select/deselect)
    if (selectedDates.includes(localDateString)) {
      setSelectedDates(selectedDates.filter((d) => d !== localDateString));
    } else {
      setSelectedDates([...selectedDates, localDateString]);
    }
  };

  const handleCalendarNavigate = (date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setCalendarValue(date);
  };

  const handleAddHolidays = async () => {
    if (selectedDates.length === 0) {
      Swal.fire("Error", "No dates selected", "error");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Convert selected dates to local time format before sending to the API
      const response = await axios.post(
        `${environment.apiUrl}/holidays/addHolidays`,
        { dates: selectedDates },
        { headers }
      );
      if (response.status === 201) {
        fetchHolidays(); // Refresh holidays list
        Swal.fire({
          title: "Success",
          text: "Holidays added successfully!",
          icon: "success",
        });
        setSelectedDates([]); // Clear selected dates after successful addition
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding holidays:", error);
      Swal.fire("Error", "Failed to add holidays", "error");
    }

    fetchHolidays();
  };

  const handleDeleteHoliday = async (holidayId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `${environment.apiUrl}/holidays/deleteHoliday/${holidayId}`,
        { headers }
      );
      if (response.status === 200) {
        fetchHolidays(); // Refresh holidays list
        Swal.fire("Success", "Holiday deleted successfully", "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      Swal.fire("Error", "Failed to delete holiday", "error");
    }

    fetchHolidays();
  };

  // Function to determine if a date is a holiday
  const isHoliday = (date) => {
    const localDateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    return holidays.some((holiday) => holiday.date === localDateString);
  };

  // Function to determine if a date is selected
  const isSelected = (date) => {
    const localDateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    return selectedDates.includes(localDateString);
  };

  return (
    <Box m="20px">
      <Header title="Manage Holidays" />

      {/* Year and Month Selection */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="10px"
      >
        <Box flex={1}>
          {/* Year Select */}
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              marginRight: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2, // Ensure rounded borders
              },
            }}
          >
            <Typography variant="h5" component="span" fontWeight="bold" mb={1}>
              Year
            </Typography>
            <Select
              value={year}
              onChange={handleYearChange}
              sx={{
                borderRadius: 2, // Keep the border clean
              }}
            >
              {[...Array(10).keys()].map((i) => (
                <MenuItem key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Month Select */}
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2, // Ensure rounded borders
              },
            }}
          >
            <Typography variant="h5" component="span" fontWeight="bold" mb={1}>
              Month
            </Typography>
            <Select
              value={month}
              onChange={handleMonthChange}
              sx={{
                borderRadius: 2, // Keep the border clean
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Calendar and Holiday List */}
      <Box display="flex" justifyContent="space-between">
        {/* Left Half - Calendar */}
        <Box flex={1} p={2}>
          <h4>Select Dates</h4>
          <Calendar
            value={calendarValue} // Reflect the updated calendarValue
            onChange={handleDateChange}
            onActiveStartDateChange={({ activeStartDate }) =>
              handleCalendarNavigate(activeStartDate)
            } // Synchronize input and calendar
            tileClassName={({ date, view }) => {
              const dateString = date.toISOString().split("T")[0];

              // Highlight if the date is selected or is a holiday
              if (isSelected(date)) {
                return "selected-date"; // Custom class for selected dates
              }

              if (isHoliday(date)) {
                return "holiday-date"; // Custom class for holidays
              }

              // Default return for all other dates, including 1st of the month and today's date
              return "no-highlight"; // This class ensures no special styling
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6870fa",
              marginTop: "15px",
              color: "white",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#3e4396",
              },
            }}
            onClick={handleAddHolidays}
          >
            Add Holidays
          </Button>
        </Box>

        {/* Right Half - Holidays List */}
        <Box flex={1} p={2}>
          <h4>
            Holidays in{" "}
            {new Date(0, month - 1).toLocaleString("default", {
              month: "long",
            })}
            , {year}
          </h4>
          <ul>
            {/* Sort holidays in ascending order by date */}
            {holidays
              .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
              .map((holiday) => (
                <li key={holiday._id}
                style={{ fontSize: "1rem" }}>
                  {holiday.date} {/* Show only date part (YYYY-MM-DD) */}
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent any unwanted parent click event
                        handleDeleteHoliday(holiday._id); // Call your delete function
                      }}
                      sx={{ color: colors.redAccent[500], marginLeft: 6 }} // Adjust the spacing
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </li>
              ))}
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default Holidays;
