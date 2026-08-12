import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fleet',
  title: 'Airline Fleet',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Aircraft Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'e.g., Boeing 777-300ER'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
      options: {
        list: [
          { title: 'Boeing', value: 'Boeing' },
          { title: 'Airbus', value: 'Airbus' },
          { title: 'Embraer', value: 'Embraer' },
          { title: 'Bombardier', value: 'Bombardier' },
          { title: 'ATR', value: 'ATR' },
          { title: 'Other', value: 'Other' },
        ],
      }
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'gallery',
      title: 'Aircraft Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Add interior or exterior photos here.'
    }),
    defineField({
      name: 'range',
      title: 'Range (km)',
      type: 'string',
      description: 'e.g., 13,649 km'
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'string',
      description: 'e.g., 350+ Guests'
    }),
    defineField({
      name: 'cruisingSpeed',
      title: 'Cruising Speed',
      type: 'string',
      description: 'e.g., Mach 0.84'
    }),
    defineField({
      name: 'engineType',
      title: 'Engine Type',
      type: 'string',
      description: 'e.g., GE90-115B'
    }),
    defineField({
      name: 'length',
      title: 'Length (m)',
      type: 'string',
      description: 'e.g., 73.9 m'
    }),
    defineField({
      name: 'wingspan',
      title: 'Wingspan (m)',
      type: 'string',
      description: 'e.g., 64.8 m'
    }),
    defineField({
      name: 'description',
      title: 'Detailed Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'manufacturer',
      media: 'mainImage',
    },
  },
})
