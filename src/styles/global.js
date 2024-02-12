import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  outline: 0;
}
body, html {
  background: #f5f5f5;
  font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
  letter-spacing: 1px;
  height: 100%;
  width: 100%;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.hide {
  display: none;
}
h1.logo{
  font-family: 'Courier New';
  letter-spacing: 15px;
}
input, textarea, select {
  transition: all 0.30s ease-in-out;
}
input.error, textarea.error, select.error {
  border: 1px solid #e74c3c;
}
input:focus, textarea:focus, select:focus {
  box-shadow: 0 0 5px #3475c1;
  border: 1px solid #3475c1;
}
input.error:focus, textarea.error:focus, select.error:focus {
  border: 1px solid #e74c3c;
  box-shadow: 0 0 5px #e74c3c;
}
.error-message {
  color: #e74c3c !important;
  margin-bottom: 10px;
}
button:disabled {
  opacity: 0.5;
}
.Toastify__toast-container {
  min-width: 30%;
  text-align: center;
  font-weight: bold;
}
.pages {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 15px;
  .pagination {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    .active {
      background-color: #55C2FF;
    }
    li {
      background-color: #fff;
      list-style-type: none;
      width: 40px;
      height: 40px;
      border: 1px solid #dbdbdb;
      cursor: pointer;
      color: #565656;
      &:hover {
        background-color: #55C2FF;
      }
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      }
    }
  }
}
.react-autosuggest__container {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.react-autosuggest__input {
  flex: 1;
  height: 46px;
  line-height: 46px;
  padding: 0 20px;
  color: #777;
  font-size: 15px;
  width: 100%;
  border: 1px solid #ddd;
  &::placeholder {
    color: #999;
  }
}
.react-autosuggest__input--focused {
  outline: none;
}
.react-autosuggest__input::-ms-clear {
  display: none;
}
.react-autosuggest__input--open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.react-autosuggest__suggestions-container {
  display: none;
}
.react-autosuggest__suggestions-container--open {
  display: block;
  position: absolute;
  width: 100%;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 15px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
}
.react-autosuggest__suggestions-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.react-autosuggest__suggestion {
  cursor: pointer;
  padding: 10px 20px;
}
.react-autosuggest__suggestion--highlighted {
  background-color: #55C2FF;
}
.p-l-20 {
  padding-left: 20px;
}
.p-r-20 {
  padding-right: 20px;
}
.p-b-20 {
  padding-bottom: 20px;
}
.m-t-15 {
  margin-top: 15px;
}
.m-b-0 {
  margin-bottom: 0;
}
`;

export default GlobalStyle;
