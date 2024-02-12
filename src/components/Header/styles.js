import styled from "styled-components";

export const HeaderBar = styled.header`
  height: 100%;
  background: #3475c1;
  margin-bottom: 15px;
  .estabelecimento {
    left: 5px;
    max-width: 600px;
    color: #fff;
    font: inherit;
    font-size: 16px;
  }
`;

export const Container = styled.div`
  max-width: 95%;
  margin: 0 auto;
  padding: 5px;
`;

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .arrow {
    float: right;
    margin-left: 5px;
  }
  .has-children {
    .has-children {
      .arrow-down {
        display: none;
      }
    }
  }
  .icon {
    display: none;
  }
  @media only screen and (max-width: 1140px) {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .arrow-right {
      display: none;
    }
    .has-children {
      .has-children {
        .arrow-down {
          display: block;
        }
      }
    }
    .responsive {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .icon {
      color: #565656;
      float: right;
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      padding-top: 30px;
      padding-right: 10px;
      background: none;
      border: none;
      font: inherit;
      cursor: pointer;
      text-decoration: none;
      .fa-bars {
        &:hover {
          color: #55c2ff;
        }
      }
    }
  }
`;

export const NavLogo = styled.div`
  a {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      height: 80px;
      width: 78px;
      padding-right: 0px 10px 10px 10px;
    }
    h1 {
      font-size: 28px;
      letter-spacing: 2px;
      font-weight: normal;
      color: #ffffff;
    }
  }
`;

export const NavLinks = styled.nav`
  @media only screen and (max-width: 1140px) {
    display: none;
    .logoutBtn {
      padding-left: 2rem;
    }
  }
  .userImg {
    display: flex;
    align-items: center;
    padding-right: 15px;
    color: #ffffff;
    img {
      height: 40px;
      width: 40px;
      border: 1px solid #fff;
      border-radius: 100%;
      float: right;
      object-fit: fill;
    }
    button {
      padding-right: 10px;
    }
    @media only screen and (max-width: 1140px) {
      img {
        position: absolute;
      }
      button {
        padding-left: 45px;
      }
    }
    @media only screen and (min-width: 1140px) {
      white-space: nowrap;
    }
  }
  .active {
    background: #ced3f5;
  }
  ul {
    background-color: #3475c1;
    display: flex;
    flex-direction: column;
    @media only screen and (min-width: 1140px) {
      flex-direction: row;
      z-index: 3;
    }
    li {
      list-style-type: none;
      &:hover {
        background: #ced3f5;
      }
      a {
        padding: 0.8rem 1rem;
        display: block;
        text-decoration: none;
        color: #ffffff;
      }
      @media only screen and (min-width: 1140px) {
        position: relative;
        flex: 1 0 auto;
        text-align: left;
        &:hover > ul {
          display: flex;
          flex-direction: column;
        }
      }
    }
    button {
      background: none;
      border: none;
      font: inherit;
      cursor: pointer;
      padding: 0.8rem 1rem;
      text-decoration: none;
      color: #565656;
      width: 100%;
      text-align: left;
    }
  }
  @media only screen and (max-width: 1140px) {
    .has-children {
      &:hover > ul {
        display: flex;
        flex-direction: column;
      }
      ul {
        background-color: #55c2ff;
        display: none;
        width: 100%;
        position: relative;
        a {
          padding-left: 3rem;
        }
        li {
          a {
            padding-left: 2rem;
          }
        }
        .has-children {
          ul {
            display: flex;
            flex-direction: column;
          }
          button {
            padding-left: 2rem;
          }
          ul {
            li {
              a {
                padding-left: 3rem;
              }
            }
          }
        }
      }
    }
  }
  @media only screen and (min-width: 1140px) {
    .has-children {
      margin-right: 10px;
      ul {
        background-color: #55c2ff;
        display: none;
        min-width: 170px;
        width: 100%;
        position: absolute;
        &:hover {
          display: flex;
          flex-direction: column;
        }
        .has-children {
          margin-right: 0;
          ul {
            left: 100%;
            top: 0;
          }
        }
      }
    }
  }
`;
