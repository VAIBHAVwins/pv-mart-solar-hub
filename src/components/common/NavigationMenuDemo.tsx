
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
          <NavigationMenuTrigger 
            className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
            onClick={(e) => {
              // Prevent default hover behavior, only respond to clicks
              e.preventDefault();
            }}
          >
            Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-blue-500/20 to-blue-700/20 p-6 no-underline outline-none focus:shadow-md hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-200"
                    to="/tools/bill-calculator"
                  >
                    <Calculator className="h-8 w-8 text-blue-600 mb-3" />
                    <div className="text-lg font-medium text-blue-900">
                      Electricity Bill Calculator
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/tools/load-calculation"
                    className="block select-none rounded-md p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-green-50 focus:bg-green-50 border border-transparent hover:border-green-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Wrench className="h-6 w-6 text-green-600" />
                      <div className="text-base font-medium leading-none text-green-900">Load Calculator</div>
                    </div>
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
