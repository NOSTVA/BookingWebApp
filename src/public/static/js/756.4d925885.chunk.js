"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[756],{9240:function(e,r,n){var t=n(4165),s=n(5861),i=n(9439),a=n(8329),o=n(1134),d=n(7689),u=n(7845),l=n(2791),c=n(9690);r.Z=function(){var e=(0,d.s0)(),r=(0,d.TH)(),n=(0,o.cI)(),h=n.register,f=n.handleSubmit,p=n.formState.errors,x=(0,l.useContext)(c.S).dispatch,m=(0,u.YA)(),j=(0,i.Z)(m,1)[0],v=(0,u.l4)(),g=(0,i.Z)(v,1)[0],S=function(){var n=(0,s.Z)((0,t.Z)().mark((function n(s){var i,o;return(0,t.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(i=s.email,o=s.password,"/login"!==r.pathname){n.next=4;break}return n.next=4,j({email:i,password:o}).then((function(r){if(r.error)return console.log(r.error.data);var n=r.data.user;x({type:"USER_LOGIN",payload:n}),a.Z.set("userInfo",JSON.stringify(n),{expires:30}),e("/")}));case 4:if("/team/auth/register"!==r.pathname){n.next=7;break}return n.next=7,g({email:i,password:o}).then((function(r){if(r.error)return console.log(r.error.data);var n=r.data.user;x({type:"USER_LOGIN",payload:n}),a.Z.set("userInfo",JSON.stringify(n),{expires:30}),e("/")}));case 7:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}();return{onSubmit:S,register:h,handleSubmit:f,errors:p}}},756:function(e,r,n){n.r(r),n.d(r,{default:function(){return j}});var t=n(1413),s=n(896),i=n(2899),a=n(1882),o=n(5946),d=n(3303),u=n(751),l=n(2392),c=n(8208),h=n(6069),f=n(4125),p=n(2435),x=n(9240),m=n(184);function j(){var e=(0,x.Z)(),r=e.onSubmit,n=e.register,j=e.handleSubmit;return(0,m.jsx)(s.M,{minH:"100vh",children:(0,m.jsxs)(i.Z,{minW:400,size:"lg",variant:"elevated",children:[(0,m.jsx)(a.O,{children:(0,m.jsx)(o.X,{textAlign:"center",size:"lg",children:"Create account"})}),(0,m.jsx)(d.e,{children:(0,m.jsx)("form",{onSubmit:j(r),children:(0,m.jsxs)(u.K,{spacing:6,children:[(0,m.jsxs)(l.NI,{isRequired:!0,children:[(0,m.jsx)(c.l,{children:"Email address"}),(0,m.jsx)(h.I,(0,t.Z)({type:"email"},n("email",{required:!0}))),(0,m.jsx)(f.J1,{children:"Invalid email address"})]}),(0,m.jsxs)(l.NI,{isRequired:!0,children:[(0,m.jsx)(c.l,{children:"Password"}),(0,m.jsx)(h.I,(0,t.Z)({type:"password"},n("password",{required:!0}))),(0,m.jsx)(f.J1,{children:"Invalid password"})]}),(0,m.jsx)(p.z,{type:"submit",colorScheme:"blue",children:"Create account"})]})})})]})})}}}]);
//# sourceMappingURL=756.4d925885.chunk.js.map