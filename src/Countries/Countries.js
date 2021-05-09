import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Countries.module.css";
import { TextField, Button } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const Countries = () => {
  //State section.
  const [countries, setCountries] = useState([]);
  const [term, setTerm] = useState("");
  const [region, setRegion] = useState("");
  // End of State section.

  const apiURL = "https://restcountries.eu/rest/v2/all";
  const searchURL = `https://restcountries.eu/rest/v2/name/`;

  useEffect(() => {
    axios.get(apiURL).then((res) => {
      setCountries(res.data);
    });
  }, []);

  // Filter by Region section
  useEffect(() => {
    const regionURL = `https://restcountries.eu/rest/v2/region/`;

    const displayFilteredCountries = () =>
      fetch(regionURL + region)
        .then((res) => res.json())
        .then((data) => setCountries(data));

    const displayAllCountries = () =>
      fetch(apiURL)
        .then((res) => res.json())
        .then((data) => setCountries(data));

    if (region === "Africa") {
      displayFilteredCountries();
    } else if (region === "Europe") {
      displayFilteredCountries();
    } else if (region === "Asia") {
      displayFilteredCountries();
    } else if (region === "Oceania") {
      displayFilteredCountries();
    } else {
      displayAllCountries();
    }
  }, [region]);

  const handleOnChange = (e) => {
    setRegion(e.target.value);
  };

  // End of Filter By Region section.

  const AlertError = () => {
    alert("Error occurs! You can search only by country name and code");
    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => setCountries(data));
  };

  // Display countries with cards and asked info.
  const DisplayCountries = Array.isArray(countries)
    ? countries.map((country) => {
        return (
          <div className={styles.countryCard} key={country.numericCode}>
            <img src={country.flag} alt="flag" />
            <div className={styles.countryDetails}>
              <h1>{country.name}</h1>
              <p>Capital: {country.capital}</p>
              <p>Region: {country.region}</p>
              <p>Population: {country.population}</p>
              <Button
                className={styles.button}
                variant="outlined"
                color="primary"
                onClick={() =>
                  window.open(
                    `https://en.wikipedia.org/wiki/${country.name}`,
                    "_blank"
                  )
                }
              >
                Show details
              </Button>
            </div>
          </div>
        );
      })
    : AlertError();

  // End of displaying countries.

  // Search by code and name section.
  const handleOnSubmit = () => {
    if (term.length === 3) {
      fetch(searchURL + term)
        .then((res) => res.json())
        .then((data) => {
          const newTerm = term.toLocaleUpperCase();
          const newData = data.filter((item) => item.alpha3Code === newTerm);

          setCountries(newData);
        })
        .catch((err) => console.log(err));
    } else {
      fetch(searchURL + term)
        .then((res) => res.json())
        .then((data) => setCountries(data));
    }
  };

  // End of search by name and code section.

  return (
    <>
      <div className={styles.searchbox}>
        <TextField
          id="outlined-basic"
          label="Search country by name..."
          size="small"
          variant="outlined"
          color="primary"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button
          className={styles.searchButton}
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleOnSubmit}
        >
          Search
        </Button>
      </div>
      <div className={styles.region}>
        <FormControl variant="filled" className={styles.form}>
          <InputLabel id="demo-simple-select-filled-label">
            Filter By Region
          </InputLabel>
          <Select
            defaultValue="None"
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={region}
            onChange={handleOnChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Africa"}>Africa</MenuItem>
            <MenuItem value={"Asia"}>Asia</MenuItem>
            <MenuItem value={"Europe"}>Europe</MenuItem>
            <MenuItem value={"Oceania"}>Oceania</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={styles.main}>{DisplayCountries}</div>
    </>
  );
};

export default Countries;
