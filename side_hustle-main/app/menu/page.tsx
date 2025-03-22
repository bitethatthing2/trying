import { FC } from 'react';
import MenuGroup from '@/components/menu/MenuGroup';
import MenuItem from '@/components/menu/MenuItem';
import MenuCategory from '@/components/menu/MenuCategory';
import { Separator } from '@/components/ui/separator';

// Icon placeholder imports
// Import these icons later: Coffee, Flame, Utensils, Fish, Egg, ChefHat, Droplet

const Menu: FC = () => {
  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Our Menu
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Enjoy our selection of crafted beverages and delicious food options
        </p>
      </div>
      
      {/* Non-Alcoholic Beverages Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <Coffee className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">☕</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Non-Alcoholic Beverages</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCategory title="Fountain Drinks" description="Unlimited refills">
            <MenuGroup subtext="$3.00">
              <MenuItem name="Coke" price="$3.00" />
              <MenuItem name="Dr Pepper" price="$3.00" />
              <MenuItem name="Diet Coke" price="$3.00" />
              <MenuItem name="Lemonade" price="$3.00" />
              <MenuItem name="Sprite" price="$3.00" />
              <MenuItem name="Sweet Ice Tea" price="$3.00" />
            </MenuGroup>
          </MenuCategory>
          
          <MenuCategory title="Glass Beverages">
            <MenuGroup subtext="$4.75">
              <MenuItem name="Topo Chico" price="$4.75" />
              <MenuItem name="Coke" price="$4.75" />
              <MenuItem name="Jarritos" price="$4.75" tags={["Multiple Flavors"]} />
              <MenuItem name="Sprite" price="$4.75" />
            </MenuGroup>
          </MenuCategory>
          
          <MenuCategory title="Smoothies" description="Comes with whipped cream">
            <MenuGroup subtext="$13.00">
              <MenuItem 
                name="Fruit Smoothies" 
                price="$13.00" 
                description="Strawberry, Watermelon, Mango, Peach, Passion Fruit, Raspberry, Prickly Pear, Pineapple, Guava, Kiwi, Blackberry, and Coconut"
              />
            </MenuGroup>
          </MenuCategory>
          
          <MenuCategory title="Other Beverages">
            <MenuGroup subtext="$4.75">
              <MenuItem name="Coffee" price="$4.75" />
              <MenuItem name="Abuelita Hot Chocolate" price="$4.75" />
              <MenuItem name="Red Bull" price="$4.75" />
            </MenuGroup>
          </MenuCategory>
        </div>
      </section>
      
      <Separator className="my-12 bg-bar-accent/20" />
      
      {/* Birria Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <Flame className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">🔥</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Birria Specialties</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCategory title="Birria" description="ALL BIRRIA ITEMS COME WITH CONSUME">
            <MenuItem 
              name="Birria Queso Tacos" 
              price="$16.75" 
              description="3 QUESO BIRRIA TACOS, QUESO OAXACA, ONIONS, CILANTRO" 
            />
            <MenuItem 
              name="Birria Pizza" 
              price="$29.00" 
              description="TWO FLOUR TORTILLAS, CILANTRO, ONIONS, QUESO OAXACA" 
            />
            <MenuItem 
              name="Birria Ramen Bowl" 
              price="$14.75" 
              description="BIRRIA TAPATIO NOODLES, CILANTRO AND ONIONS" 
            />
            <MenuItem 
              name="Birria Flautas" 
              price="$12.00" 
              description="CORN TORTILLA, BIRRIA, CONSUME" 
            />
          </MenuCategory>
          
          <MenuCategory title="House Sauces" description="ALL SAUCE MADE IN HOUSE">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">Chefa Sauce</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">Guac</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">Tomatillo</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">Ranchera</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">Chile De Arbol</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">Habanero</p>
              </div>
            </div>
          </MenuCategory>
        </div>
      </section>
      
      <Separator className="my-12 bg-bar-accent/20" />
      
      {/* Small Bites Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <Utensils className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">🍴</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Small Bites</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCategory title="Tacos" description="Gluten free corn tortilla, onions, cilantro, choice of meat">
            <MenuItem name="Regular Tacos" price="$3.75" />
            <MenuItem name="Queso Tacos" price="$5.75" description="Gluten free corn tortilla, queso Oaxaca, onions, cilantro, choice of meat" />
          </MenuCategory>
          
          <MenuCategory title="Sides">
            <MenuItem name="Chips & Guac" price="$8.00" />
            <MenuItem name="Basket of Fries" price="$7.00" />
            <MenuItem name="Basket of Tots" price="$7.00" />
          </MenuCategory>
        </div>
      </section>
      
      <Separator className="my-12 bg-bar-accent/20" />
      
      {/* Seafood Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <Fish className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">🐟</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Seafood</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCategory title="Fried Fish">
            <MenuItem 
              name="Fried Fish Tacos (2)" 
              price="$8.75" 
              description="ONIONS, CABBAGE, CHIPOTLE, CHEESE, CORN TORTILLA" 
            />
          </MenuCategory>
          
          <MenuCategory title="Fried Shrimp">
            <MenuItem 
              name="Fried Shrimp Tacos (2)" 
              price="$8.75" 
              description="ONIONS, CABBAGE, CHIPOTLE, CHEESE, CORN TORTILLA" 
            />
          </MenuCategory>
        </div>
      </section>
      
      <Separator className="my-12 bg-bar-accent/20" />
      
      {/* Breakfast Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <Egg className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">🍳</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Breakfast</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCategory title="Burritos w/Eggs">
            <MenuItem 
              name="Asada & Bacon" 
              price="$13.00" 
              description="FLOUR TORTILLA, ASADA, BACON, TOTS, SOUR CREAM, GUAC SAUCE" 
            />
          </MenuCategory>
        </div>
      </section>
      
      <Separator className="my-12 bg-bar-accent/20" />
      
      {/* Wings Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <ChefHat className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">👨‍🍳</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Wings</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <MenuCategory title="Wings" description="4 FOR $8 OR 8 FOR $15">
            <p className="text-white font-medium mb-3">TRADITIONAL OR BONELESS</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">KOREAN BBQ</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">MANGO HABANERO</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">SWEET TERIYAKI</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">GARLIC BUFFALO</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">BUFFALO</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">GARLIC PARMESAN</p>
              </div>
              <div className="bg-bar-dark/40 p-3 rounded">
                <p className="text-white font-medium">BBQ</p>
              </div>
            </div>
          </MenuCategory>
        </div>
      </section>
      
      <Separator className="my-12 bg-bar-accent/20" />
      
      {/* Main Dishes Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          {/* <Droplet className="h-6 w-6 text-bar-accent mr-3" /> */}
          <span className="h-6 w-6 text-bar-accent mr-3 bg-bar-accent/20 flex items-center justify-center rounded-full">💧</span>
          <h2 className="font-display text-2xl md:text-3xl text-white">Main Dishes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCategory title="Specialty Items">
            <MenuItem 
              name="Burrito" 
              price="$12.00" 
              description="Flour tortilla, beans, rice, cilantro, onions, guac sauce, chipotle, tortilla chips, choice of meat" 
            />
            <MenuItem 
              name="Quesadilla" 
              price="$14.00" 
              description="Flour tortilla, queso Oaxaca, guac sauce, choice of meat" 
            />
            <MenuItem 
              name="Torta" 
              price="$13.50" 
              description="Bread, queso Oaxaca, beans, lettuce, tomatoes, onions, cilantro, avocado, jalapeños, chipotle, guac sauce, cotija, choice of meat" 
            />
          </MenuCategory>
          
          <MenuCategory title="Specialties & Sides">
            <MenuItem 
              name="Flautas (4)" 
              price="$10.00" 
              description="Potatoes and carnitas" 
            />
            <MenuItem 
              name="Mulitas" 
              price="$7.75" 
              description="Corn tortilla, queso Oaxaca, cilantro, onions, guac sauce, choice of meat" 
            />
            <MenuItem 
              name="Vampiros" 
              price="$7.75" 
              description="Corn tortilla, queso Oaxaca, guacamole, choice of meat" 
            />
            <MenuItem 
              name="Empanadas" 
              price="$7.00" 
              description="Fried flour, queso Oaxaca, sour cream, guac sauce, lettuce" 
            />
          </MenuCategory>
          
          <MenuCategory title="Loaded Specialties">
            <MenuItem 
              name="Loaded Fries (Full)" 
              price="$19.00" 
              description="Nacho cheese, pico, jalapeños, guac sauce, chipotle, cotija, sour cream, choice of meat" 
            />
            <MenuItem name="Loaded Fries (Half)" price="$12.00" />
            <MenuItem 
              name="Loaded Nachos (Full)" 
              price="$19.00" 
              description="Nacho cheese, pico, jalapeños, guac sauce, chipotle, cotija, sour cream, choice of meat" 
            />
            <MenuItem name="Loaded Nachos (Half)" price="$12.00" />
          </MenuCategory>
          
          <MenuCategory title="Bowls & Salads">
            <MenuItem 
              name="Hustle Bowl" 
              price="$15.00" 
              description="Beans, rice, lettuce, pico, jalapeños, sour cream, guac sauce, cotija, tortilla chips, choice of meat" 
            />
            <MenuItem 
              name="Taco Salad" 
              price="$14.00" 
              description="Flour tortilla, lettuce, pico, cilantro, sour cream, cotija, choice of meat" 
            />
          </MenuCategory>
        </div>
      </section>
      
      {/* Meat Options Section */}
      <section className="mt-12">
        <div className="bg-bar-muted/50 border border-bar-accent/20 p-6 rounded-lg">
          <h3 className="font-display text-xl text-white mb-4">Meat Options</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Asada</p>
              <p className="text-gray-400 text-sm">Beef</p>
            </div>
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Birria</p>
              <p className="text-gray-400 text-sm">Beef</p>
            </div>
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Al Pastor</p>
              <p className="text-gray-400 text-sm">Pork</p>
            </div>
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Carnitas</p>
              <p className="text-gray-400 text-sm">Pork</p>
            </div>
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Chorizo</p>
              <p className="text-gray-400 text-sm">Pork</p>
            </div>
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Pollo</p>
              <p className="text-gray-400 text-sm">Chicken</p>
            </div>
            <div className="bg-bar-dark/40 p-3 rounded">
              <p className="text-white font-medium">Veggies</p>
              <p className="text-gray-400 text-sm">+$2.00 Lengua</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu; 