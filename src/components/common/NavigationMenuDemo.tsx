
import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Calculator, Wrench } from "lucide-react";

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium">
            Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/20 to-blue-700/20 p-6 no-underline outline-none focus:shadow-md"
                    to="/tools/bill-calculator"
                  >
                    <Calculator className="h-6 w-6 text-blue-600" />
                    <div className="mb-2 mt-4 text-lg font-medium text-blue-900">
                      Electricity Bill Calculator
                    </div>
                    <p className="text-sm leading-tight text-blue-700">
                      Calculate your electricity bill for CESC and Bihar (NBPCL/SBPCL) providers with detailed breakdown
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/tools/load-calculation"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-green-600" />
                      <div className="text-sm font-medium leading-none">Load Calculation</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Calculate electrical load requirements for your home
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuDemo;
