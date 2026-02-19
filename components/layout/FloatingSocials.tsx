'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '../ui/icons/WhatsAppIcon';
import { FacebookIcon, InstagramIcon, MailIcon, TikTokIcon } from '../ui/icons/SocialIcons';
import { getMapUrl } from '@/lib/utils/map-helper';

export function FloatingSocials() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null; // Admin panelinde floating ikonları gizle
    }

    const socialLinks = [
        {
            id: 'phone',
            icon: Phone,
            href: 'tel:+4317673287',
            label: 'Telefon',
            color: '#007AFF'
        },
        {
            id: 'whatsapp',
            icon: WhatsAppIcon,
            href: 'https://wa.me/4317673287',
            label: 'WhatsApp',
            color: '#25D366'
        },
        {
            id: 'instagram',
            icon: InstagramIcon,
            href: 'https://www.instagram.com/fahrschule_gate11',
            label: 'Instagram',
            color: '#E1306C'
        },
        {
            id: 'facebook',
            icon: FacebookIcon,
            href: 'https://www.facebook.com/FahrschuleGATE11',
            label: 'Facebook',
            color: '#1877F2'
        },
        {
            id: 'tiktok',
            icon: TikTokIcon,
            href: 'https://www.tiktok.com/@fahrschule_gate_11?_r=1&_t=ZN-93OWbF0JcFK',
            label: 'TikTok',
            color: '#FE2C55' // TikTok Brand Color
        },
        {
            id: 'mail',
            icon: MailIcon,
            href: 'mailto:drive@fahrschulegate11.at',
            label: 'E-Mail',
            color: '#EA4335'
        },
        {
            id: 'location',
            icon: MapPin,
            href: getMapUrl(),
            label: 'Standort',
            color: '#FF5A5F'
        }
    ];

    return (
        <>
            {/* Masaüstü Görünümü: Soldaki Dikey Araç Çubuğu */}
            <div key={`desktop-${pathname}`} className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-4">
                {socialLinks.map((item, index) => (
                    <motion.a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="group relative p-3 bg-background/40 backdrop-blur-md border border-white/10 rounded-full transition-all duration-500 hover:scale-110 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                        <item.icon
                            className="w-7 h-7 transition-all duration-300 group-hover:scale-110"
                            style={{ color: item.color }}
                        />
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 bg-primary transition-opacity duration-300" />
                    </motion.a>
                ))}

                {/* Bağlantı Çizgisi */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100px' }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -bottom-[110px] left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-primary/90 to-transparent"
                />
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100px' }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -top-[110px] left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-t from-primary/90 to-transparent"
                />
            </div>

            {/* Mobil Görünüm: Tam Genişlikte Alt Navigasyon Çubuğu */}
            <div key={`mobile-${pathname}`} className="fixed bottom-0 left-0 right-0 z-[100] xl:hidden flex items-center justify-around p-3 pb-6 bg-background/90 backdrop-blur-2xl border-t border-white/5 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-700">
                {socialLinks.map((item, index) => (
                    <motion.a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className="flex flex-col items-center group active:scale-90 transition-transform"
                    >
                        <div
                            className="p-2.5 rounded-2xl shadow-lg ring-1 ring-white/10"
                            style={{ backgroundColor: item.color }}
                        >
                            <item.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                    </motion.a>
                ))}
            </div>
        </>
    );
}
