import { CATEGORIES } from "./services/postService";

export const BLOG_CONFIG = {
    name: "KIDIMOS",
    asciiLogo: `
 ██╗  ██╗██╗██████╗ ██╗███╗   ███╗ ██████╗ ███████╗
 ██║ ██╔╝██║██╔══██╗██║████╗ ████║██╔═══██╗██╔════╝
 █████╔╝ ██║██║  ██║██║██╔████╔██║██║   ██║███████╗
 ██╔═██╗ ██║██║  ██║██║██║╚██╔╝██║██║   ██║╚════██║
 ██║  ██╗██║██████╔╝██║██║ ╚═╝ ██║╚██████╔╝███████║
 ╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝
  `,
    version: "4.0.0-PRO",
    author: "KIDIMOS",
    avatarUrl: "http://q.qlogo.cn/headimg_dl?dst_uin=865055361&spec=640&img_type=jpg",
    title: "kidimosctl@gmail.com",
    bio: "欢迎来到我的终端式博客!",
    prompt: "user@kidimos",
    location: "Hong Kong / China",
    categories: CATEGORIES,
    defaultTheme: "matrix",
    systemStatus: {
        cpu: "QUANTUM-X12",
        ram: "256GB NEURAL-LINK",
        uptime: "100%",
        kernel: "KDN_5.2.1-ULTRA"
    }
};
