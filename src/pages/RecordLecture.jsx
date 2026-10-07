import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, Square, ArrowLeft } from "lucide-react";

export default function RecordLecture() {
  const videoRef=useRef(null);const mediaRecorderRef=useRef(null);const chunks=useRef([]);
  const [recording,setRecording]=useState(false);const [progress,setProgress]=useState(0);const [stream,setStream]=useState(null);
  const navigate=useNavigate();const location=useLocation();const recordedIndex=location.state?.recordedIndex ?? 0;

  useEffect(()=>{let active=true;const start=async()=>{try{const mediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});if(!active)return;setStream(mediaStream);if(videoRef.current)videoRef.current.srcObject=mediaStream;}catch{alert("Camera or microphone access denied!");}};start();return()=>{active=false;stream?.getTracks().forEach(t=>t.stop());};},[]);
  useEffect(()=>{if(!recording)return;const interval=setInterval(()=>setProgress(p=>p<100?p+0.4:0),200);return()=>clearInterval(interval);},[recording]);

  const startRecording=()=>{if(!stream)return;chunks.current=[];const recorder=new MediaRecorder(stream);mediaRecorderRef.current=recorder;recorder.ondataavailable=e=>{if(e.data.size>0)chunks.current.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks.current,{type:"video/webm"});const url=URL.createObjectURL(blob);stream.getTracks().forEach(t=>t.stop());navigate("/add-skill",{state:{recordedVideo:url,recordedIndex}})};recorder.start();setRecording(true);};
  const stopRecording=()=>{setRecording(false);if(mediaRecorderRef.current?.state==="recording")mediaRecorderRef.current.stop();};

  return <section className="recorder"><div className="flex justify-between items-end mb-6 gap-4"><div><div className="eyebrow">STUDIO / RECORD</div><h1 className="display">Record<br/>a lesson.</h1></div><button className="btn" onClick={()=>navigate("/add-skill")}><ArrowLeft size={14}/> Back</button></div><div className="recorder-stage"><video ref={videoRef} autoPlay muted playsInline/><div className="recorder-overlay">{!recording&&<div className="text-center"><Mic className="mx-auto text-[#9be878]" size={42} strokeWidth={1.2}/><div className="eyebrow mt-3">CAMERA READY</div><p className="muted text-xs mt-2">Frame yourself, then hit record.</p></div>}</div><div className="recorder-progress" style={{width:`${progress}%`}}/></div><div className="flex justify-center gap-3 mt-5"><button onClick={recording?stopRecording:startRecording} className={`btn ${recording?"btn-danger":"btn-green"}`}>{recording?<><Square size={13} fill="currentColor"/> Stop recording</>:<><Mic size={13}/> Start recording</>}</button><button onClick={()=>navigate("/add-skill")} className="btn">Cancel</button></div></section>;
}
