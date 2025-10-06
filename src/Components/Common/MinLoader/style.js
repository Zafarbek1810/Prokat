import styled from "styled-components";

const LoaderWrapper = styled.div`
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
    width: 120px;
    height: 120px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 96px;
    height: 96px;
    margin: 12px;
    border-radius: 50%;
    border: 3px solid #1F3C88;
    border-color: #1F3C88 transparent #1F3C88 transparent;
    animation: lds-dual-ring2 1.5s linear infinite;
  }
  
  .lds-dual-ring2 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .lds-dual-ring2:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 3px solid #1F3C88;
    border-color: #1F3C88 transparent #1F3C88 transparent;
    animation: lds-dual-ring 1.5s linear infinite;
  }
`

export {
  LoaderWrapper
}
