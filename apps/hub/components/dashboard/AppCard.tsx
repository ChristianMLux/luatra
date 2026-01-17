"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { Badge, Card } from "@repo/ui";

export interface AppCardProps {
  appName: string;
  description: string;
  href: string;
  icon?: ReactNode;
  status?: "online" | "offline" | "maintenance";
  port?: number;
}

export function AppCard({
  appName,
  description,
  href,
  icon,
  status = "online",
  port,
}: AppCardProps) {
  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full bg-glass-low hover:bg-glass-medium border-glass-border hover:border-cyber-pink/50 transition-colors duration-300 relative overflow-hidden">
          {/* Status Indicator */}
          <div className="absolute top-4 right-4 z-10">
            <Badge 
              variant="outline" 
              className={`
                ${status === 'online' ? 'border-cyber-neon text-cyber-neon bg-cyber-neon/10' : ''}
                ${status === 'offline' ? 'border-red-500 text-red-500 bg-red-500/10' : ''}
                ${status === 'maintenance' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : ''}
              `}
            >
              {status.toUpperCase()}
            </Badge>
          </div>

          <div className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              {icon && (
                <div className="p-3 rounded-lg bg-glass-high text-cyber-cyan border border-glass-border group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-cyber-cyan transition-colors">
                  {appName}
                </h3>
                {port && (
                  <span className="text-xs text-muted-foreground font-mono">
                    PORT: {port}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
              {description}
            </p>

            {/* Action Hint */}
            <div className="flex items-center text-xs font-semibold text-cyber-pink opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              LAUNCH SYSTEM &rarr;
            </div>
          </div>
          
          {/* Decoration */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
      </motion.div>
    </Link>
  );
}
