import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Cleaning database...');
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customBuild.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.cMSContent.deleteMany();
  await prisma.user.deleteMany();

  console.log('[SEED] Creating default users...');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('AdminPass123!', salt);
  const userPassword = await bcrypt.hash('UserPass123!', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Atlas Sterling',
      email: 'admin@lumendeli.com',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Lucas Vance',
      email: 'user@lumendeli.com',
      password: userPassword,
      role: 'USER',
      isVerified: true,
    },
  });

  console.log('[SEED] Creating catalog products...');
  
  // Product 1: Aurora Eclipse Lamp
  const p1 = await prisma.product.create({
    data: {
      name: 'Aurora Eclipse Lamp',
      slug: 'aurora-eclipse-lamp',
      description: 'A bespoke multi-axis 3D printed lamp. Features fluid glass-morphic patterns inspired by magnetic fields, combining custom OLED light tubes with a premium weighted base.',
      basePrice: 149,
      category: 'LAMP',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
      ],
      specs: {
        'Dimensions': '320mm H x 180mm W',
        'Base Material': 'Sintered Anodized Aluminum',
        'Shade Material': 'Recycled Polycarbonate Matrix',
        'Light Output': '850 Lumens (Variable RGB)',
        'Interface': 'Capacitive touch & Mobile APP control',
      },
      isCustomizable: true,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        productId: p1.id,
        sku: 'LMP-AUR-BLK',
        name: 'Matte Jet Black',
        price: 149,
        stock: 45,
        attributes: { color: 'Matte Black', material: 'Sintered PLA', size: 'Standard' },
      },
      {
        productId: p1.id,
        sku: 'LMP-AUR-FST',
        name: 'Frosted Crystal Clear',
        price: 169,
        stock: 30,
        attributes: { color: 'Frosted White', material: 'Resin Sinter', size: 'Standard' },
      },
      {
        productId: p1.id,
        sku: 'LMP-AUR-COP',
        name: 'Liquid Amber Copper',
        price: 159,
        stock: 12,
        attributes: { color: 'Aesthetic Copper', material: 'Copper PLA Mix', size: 'Standard' },
      },
    ],
  });

  // Product 2: Helios Prism Lamp
  const p2 = await prisma.product.create({
    data: {
      name: 'Helios Prism Lamp',
      slug: 'helios-prism-lamp',
      description: 'Sculptured lighting incorporating mathematical refraction nodes. Uses multi-layered refractive lenses to cast rainbow patterns across vertical walls.',
      basePrice: 129,
      category: 'LAMP',
      images: [
        'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=800',
      ],
      specs: {
        'Dimensions': '240mm H x 140mm W',
        'Base Material': 'Brushed Brass Base',
        'Diffuser': 'Prismatic Refraction Glass',
        'Light Output': '600 Lumens (OLED Glow)',
      },
      isCustomizable: true,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        productId: p2.id,
        sku: 'LMP-HEL-BRS',
        name: 'Brushed Brass Base',
        price: 129,
        stock: 25,
        attributes: { color: 'Brushed Gold', material: 'Brass & Acrylic', size: 'Compact' },
      },
      {
        productId: p2.id,
        sku: 'LMP-HEL-SLV',
        name: 'Sleek Chrome Silver',
        price: 139,
        stock: 15,
        attributes: { color: 'Chrome Silver', material: 'Aluminum & Acrylic', size: 'Compact' },
      },
    ],
  });

  // Product 3: Aerolite Pro Drone Frame
  const p3 = await prisma.product.create({
    data: {
      name: 'Aerolite Pro Drone Frame',
      slug: 'aerolite-pro-drone-frame',
      description: 'Bespoke FPV racing and cinematography quadcopter frame. CNC cut from Toray T700 carbon fiber matrices and reinforced with 3D printed vibration dampers.',
      basePrice: 249,
      category: 'DRONE',
      images: [
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
      ],
      specs: {
        'Size (Arm to Arm)': '220mm Standard (5 inch Propellers)',
        'Plate Thickness': '5mm Arms, 2mm Base Plates',
        'Material Grade': 'Toray T700 3K Carbon Fiber Matte',
        'Mounting Patterns': '30x30mm & 20x20mm stacks',
      },
      isCustomizable: true,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        productId: p3.id,
        sku: 'DRN-AER-3K',
        name: 'Carbon 3K Matte',
        price: 249,
        stock: 75,
        attributes: { color: 'Carbon Gray', material: 'Carbon Fiber Matte', size: '220mm' },
      },
      {
        productId: p3.id,
        sku: 'DRN-AER-GLS',
        name: 'Carbon Gloss Twill',
        price: 269,
        stock: 40,
        attributes: { color: 'Carbon Gloss', material: 'Carbon Fiber Gloss', size: '220mm' },
      },
      {
        productId: p3.id,
        sku: 'DRN-AER-TI',
        name: 'Titanium Arm Core',
        price: 349,
        stock: 8,
        attributes: { color: 'Metallic Dark', material: 'Titanium & Carbon', size: '220mm' },
      },
    ],
  });

  // Product 4: Vector X Propeller Guard
  const p4 = await prisma.product.create({
    data: {
      name: 'Vector X Propeller Guard',
      slug: 'vector-x-propeller-guard',
      description: 'Aerodynamic prop bumpers designed for close-quarter commercial operations. Sintered from high-tensile TPU for maximum impact shock absorption.',
      basePrice: 39,
      category: 'DRONE',
      images: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
      ],
      specs: {
        'Prop Clearance': 'Up to 5.1 inch props',
        'Weight': '11.5g per duct guard',
        'Material': 'High-Impact Flex TPU Sinter',
      },
      isCustomizable: false,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        productId: p4.id,
        sku: 'DRN-VEC-BLU',
        name: 'Cyan Blue guard',
        price: 39,
        stock: 120,
        attributes: { color: 'Cyan Blue', material: 'Flex TPU' },
      },
      {
        productId: p4.id,
        sku: 'DRN-VEC-RED',
        name: 'Pulse Red guard',
        price: 39,
        stock: 95,
        attributes: { color: 'Neon Red', material: 'Flex TPU' },
      },
    ],
  });

  console.log('[SEED] Creating CMS configurations...');
  await prisma.cMSContent.createMany({
    data: [
      {
        key: 'homepage_hero',
        value: {
          title: 'PRECISION LIGHTING. ROTOR MECHANICS.',
          subtitle: 'Artisanal 3D printed lamps and carbon-fiber aerospace drone components engineered for performance.',
        },
      },
      {
        key: 'manufacturing_timeline',
        value: [
          {
            title: '01 / Parametric CAD Rendering',
            description: 'Custom dimensions analyzed through mathematical shaders for absolute load structural strength.',
          },
          {
            title: '02 / Additive Thermal Fusing',
            description: 'Robotic multi-axis extruders deposit carbon threads and transparent resin matrices layer-by-layer.',
          },
          {
            title: '03 / Anodizing & Smoothing',
            description: 'Components chemical vapor-smoothed or sandblasted to dynamic metallic finishes.',
          },
          {
            title: '04 / Hardware Integration',
            description: 'Hand-installed LED OLED neon arrays or titanium engine core connectors tested for release.',
          },
        ],
      },
      {
        key: 'philosophy',
        value: {
          title: 'OUR ENGINEERING CODE',
          body: 'We reject the disposability of modern goods. By combining rapid additive manufacturing with heavy aerospace alloys, we build structures designed to outlast normal product lifespans while presenting stunning modern visual impacts.',
        },
      },
    ],
  });

  console.log('[SEED] Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[SEED] Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
