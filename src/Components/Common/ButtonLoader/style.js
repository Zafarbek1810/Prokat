import styled from "styled-components";

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes lds-dual-ring2 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }

  .lds-dual-ring {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 20px;
    height: 20px;
    margin: 2.5px;
    border-radius: 50%;
    border: 2px solid #1F3C88;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring2 1.5s linear infinite;
  }
`

export {
  LoaderWrapper
}
