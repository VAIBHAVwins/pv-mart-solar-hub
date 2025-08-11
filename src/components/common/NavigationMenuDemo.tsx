
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Calculator, Wrench } from 'lucide-react';

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-600 hover:text-green-600">
            Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <div className="grid gap-3">
                <NavigationMenuLink asChild>
                  <Link
                    to="/tools/load-calculation"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-blue-600 group-hover:text-green-600" />
                      <div className="text-sm font-medium leading-none">Load Calculation</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Calculate your monthly electricity consumption based on appliance usage
                    </p>
                  </Link>
                </NavigationMenuLink>
                
                <NavigationMenuLink asChild>
                  <Link
                    to="#"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-gray-400" />
                      <div className="text-sm font-medium leading-none">More Tools</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Coming soon - Additional calculation tools
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuDemo;
