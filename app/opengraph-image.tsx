import { ImageResponse } from "next/og";

export const size = {width:1200,height:630};
export const contentType = "image/png";
export const alt = "Precious Afolabi | Norwegian and Danish Localization";

export default function Image() {
  return new ImageResponse(
    <div style={{display:"flex",width:"100%",height:"100%",background:"#fafaf7",color:"#080808",padding:"78px",fontFamily:"Arial, sans-serif",flexDirection:"column",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",fontSize:35,fontWeight:700,letterSpacing:"-1px"}}>Precious Afolabi<span style={{color:"#d69e00"}}>.</span></div>
      <div style={{display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:77,fontWeight:700,letterSpacing:"-4px",lineHeight:1.08}}>Nordic language expertise.</div>
        <div style={{fontSize:77,fontWeight:700,letterSpacing:"-4px",lineHeight:1.08,color:"#a77b00"}}>Global impact.</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",borderTop:"2px solid #080808",paddingTop:25,fontSize:25}}>
        <span>Norwegian · Danish · English</span><span>preciouswrks.com</span>
      </div>
    </div>,size);
}
