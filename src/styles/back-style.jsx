import styled from 'styled-components'

export const _back_ = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	

	.print{
		background :rgba(221, 221, 221, 0.855);
		
		width: 100%;
		height: 100%;

	}

	.light{
		background :rgba(243,244,250,1);
		
		width: 100%;
		height: 100%;
		#glow {
			background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(243,244,250,1) 50%, rgba(243,244,250,1) 68%, rgba(255,255,255,1) 68%, rgba(255,255,255,1) 73%, rgba(243,244,250,1) 73%);
		}
	}
	.dark{
		/* background: radial-gradient(123.22% 129.67% at 100.89% -5.6%, #201D47 0%, #17153A 100%); */
		background: rgba(49,24,96,1);
		width: 100%;
		height: 100%;
		#glow {	
			background: radial-gradient(circle, rgba(37,84,140,1) 0%, rgba(22,51,124,1) 37%, rgba(49,24,96,1) 54%, rgba(49,24,96,1) 100%);
			/* background: radial-gradient(ellipse at center, rgba(0,156,255,0.05) 25%,rgba(0,156,255,0.15) 53%,rgba(0,156,255,0.05) 56%,rgba(0,156,255,0) 70%); */
		}


	}

	.gradation{
		background-image: ${props => props.isDarkMode ? 
		"linear-gradient(to left bottom, #830089, #6f1b8b, #5b278b, #462d88, #303183, #273083, #1b3082, #072f82, #092c88, #11288d, #1b2292, #251b96)"
		:"radial-gradient(at 50% 40%,#fff,transparent 80%),radial-gradient(at 50% -47%,rgb(151,203,245),transparent 80%),radial-gradient(at 100% 0,#b8c8e7 0,transparent 32%),radial-gradient(at 100% 98%,rgb(158 106 226 / 37%),transparent),radial-gradient(at 0 97%,rgb(178,138,253),transparent)"};
	}

	


	#myearth {
		width: 100%;
		height: 100vh;
		max-height: 100vw;
		overflow: hidden;

		opacity: 0;
		transition: opacity 1.5s ease-in;
	}

	#myearth.earth-ready {
		opacity: 1;
	}

	#myearth::before {
		content: none;
	}


/* background glow */


	#test {
		width: 50%;
		height: 300px;
		
		background: rgb(34,193,195);
		background: linear-gradient(322deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
	}

	#glow {
		position: absolute;
		top: 55%;
		left: 50%;
		width: 100%;
		max-width: ${props => props.isDarkMode ? "100vh" : "114vh"} ;
		/* max-width: 114vh; */
		height: 100vh;
		max-height: 100vw;
		transform: translate(-42%, -55%);

		/* background: rgb(41, 38, 38); */
		
	}


	.back-img {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		img, video {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
		
`