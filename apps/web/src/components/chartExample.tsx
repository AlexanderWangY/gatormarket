import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const chartData = [
  {
    timestamp: '2024-01-01T12:00:00Z',
    Yes: 0.505,
    No: 0.495,
  },
  {
    timestamp: '2024-01-01T18:00:00Z',
    Yes: 0.507,
    No: 0.493,
  },
  {
    timestamp: '2024-01-01T23:00:00Z',
    Yes: 0.511,
    No: 0.489,
  },
  {
    timestamp: '2024-01-02T00:00:00Z',
    Yes: 0.516,
    No: 0.484,
  },
  {
    timestamp: '2024-01-02T03:00:00Z',
    Yes: 0.524,
    No: 0.476,
  },
  {
    timestamp: '2024-01-02T04:00:00Z',
    Yes: 0.519,
    No: 0.481,
  },
  {
    timestamp: '2024-01-02T05:00:00Z',
    Yes: 0.513,
    No: 0.487,
  },
  {
    timestamp: '2024-01-02T09:00:00Z',
    Yes: 0.51,
    No: 0.49,
  },
  {
    timestamp: '2024-01-02T10:00:00Z',
    Yes: 0.518,
    No: 0.482,
  },
  {
    timestamp: '2024-01-02T12:00:00Z',
    Yes: 0.525,
    No: 0.475,
  },
  {
    timestamp: '2024-01-02T13:00:00Z',
    Yes: 0.524,
    No: 0.476,
  },
  {
    timestamp: '2024-01-02T18:00:00Z',
    Yes: 0.523,
    No: 0.477,
  },
  {
    timestamp: '2024-01-02T20:00:00Z',
    Yes: 0.525,
    No: 0.475,
  },
  {
    timestamp: '2024-01-03T01:00:00Z',
    Yes: 0.532,
    No: 0.468,
  },
  {
    timestamp: '2024-01-03T04:00:00Z',
    Yes: 0.527,
    No: 0.473,
  },
  {
    timestamp: '2024-01-03T09:00:00Z',
    Yes: 0.523,
    No: 0.477,
  },
  {
    timestamp: '2024-01-03T12:00:00Z',
    Yes: 0.516,
    No: 0.484,
  },
  {
    timestamp: '2024-01-03T18:00:00Z',
    Yes: 0.52,
    No: 0.48,
  },
  {
    timestamp: '2024-01-03T22:00:00Z',
    Yes: 0.51,
    No: 0.49,
  },
  {
    timestamp: '2024-01-03T23:00:00Z',
    Yes: 0.507,
    No: 0.493,
  },
  {
    timestamp: '2024-01-04T04:00:00Z',
    Yes: 0.497,
    No: 0.503,
  },
  {
    timestamp: '2024-01-04T05:00:00Z',
    Yes: 0.501,
    No: 0.499,
  },
  {
    timestamp: '2024-01-04T06:00:00Z',
    Yes: 0.51,
    No: 0.49,
  },
  {
    timestamp: '2024-01-04T09:00:00Z',
    Yes: 0.519,
    No: 0.481,
  },
  {
    timestamp: '2024-01-04T10:00:00Z',
    Yes: 0.511,
    No: 0.489,
  },
  {
    timestamp: '2024-01-04T13:00:00Z',
    Yes: 0.501,
    No: 0.499,
  },
  {
    timestamp: '2024-01-04T18:00:00Z',
    Yes: 0.509,
    No: 0.491,
  },
  {
    timestamp: '2024-01-04T23:00:00Z',
    Yes: 0.511,
    No: 0.489,
  },
  {
    timestamp: '2024-01-05T03:00:00Z',
    Yes: 0.509,
    No: 0.491,
  },
  {
    timestamp: '2024-01-05T09:00:00Z',
    Yes: 0.518,
    No: 0.482,
  },
  {
    timestamp: '2024-01-05T14:00:00Z',
    Yes: 0.525,
    No: 0.475,
  },
  {
    timestamp: '2024-01-05T16:00:00Z',
    Yes: 0.523,
    No: 0.477,
  },
  {
    timestamp: '2024-01-05T19:00:00Z',
    Yes: 0.517,
    No: 0.483,
  },
  {
    timestamp: '2024-01-05T22:00:00Z',
    Yes: 0.524,
    No: 0.476,
  },
  {
    timestamp: '2024-01-06T02:00:00Z',
    Yes: 0.528,
    No: 0.472,
  },
  {
    timestamp: '2024-01-06T07:00:00Z',
    Yes: 0.52,
    No: 0.48,
  },
  {
    timestamp: '2024-01-06T11:00:00Z',
    Yes: 0.515,
    No: 0.485,
  },
  {
    timestamp: '2024-01-06T15:00:00Z',
    Yes: 0.518,
    No: 0.482,
  },
  {
    timestamp: '2024-01-06T17:00:00Z',
    Yes: 0.512,
    No: 0.488,
  },
  {
    timestamp: '2024-01-06T22:00:00Z',
    Yes: 0.513,
    No: 0.487,
  },
  {
    timestamp: '2024-01-07T03:00:00Z',
    Yes: 0.514,
    No: 0.486,
  },
  {
    timestamp: '2024-01-07T04:00:00Z',
    Yes: 0.507,
    No: 0.493,
  },
  {
    timestamp: '2024-01-07T07:00:00Z',
    Yes: 0.498,
    No: 0.502,
  },
  {
    timestamp: '2024-01-07T11:00:00Z',
    Yes: 0.499,
    No: 0.501,
  },
  {
    timestamp: '2024-01-07T14:00:00Z',
    Yes: 0.508,
    No: 0.492,
  },
  {
    timestamp: '2024-01-07T19:00:00Z',
    Yes: 0.5,
    No: 0.5,
  },
  {
    timestamp: '2024-01-07T23:00:00Z',
    Yes: 0.493,
    No: 0.507,
  },
  {
    timestamp: '2024-01-08T03:00:00Z',
    Yes: 0.5,
    No: 0.5,
  },
  {
    timestamp: '2024-01-08T07:00:00Z',
    Yes: 0.494,
    No: 0.506,
  },
  {
    timestamp: '2024-01-08T12:00:00Z',
    Yes: 0.49,
    No: 0.51,
  },
  {
    timestamp: '2024-01-08T14:00:00Z',
    Yes: 0.481,
    No: 0.519,
  },
  {
    timestamp: '2024-01-08T15:00:00Z',
    Yes: 0.474,
    No: 0.526,
  },
  {
    timestamp: '2024-01-08T20:00:00Z',
    Yes: 0.468,
    No: 0.532,
  },
  {
    timestamp: '2024-01-08T23:00:00Z',
    Yes: 0.459,
    No: 0.541,
  },
  {
    timestamp: '2024-01-09T02:00:00Z',
    Yes: 0.457,
    No: 0.543,
  },
  {
    timestamp: '2024-01-09T04:00:00Z',
    Yes: 0.455,
    No: 0.545,
  },
  {
    timestamp: '2024-01-09T07:00:00Z',
    Yes: 0.457,
    No: 0.543,
  },
  {
    timestamp: '2024-01-09T11:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-09T16:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-09T22:00:00Z',
    Yes: 0.44,
    No: 0.56,
  },
  {
    timestamp: '2024-01-10T02:00:00Z',
    Yes: 0.44,
    No: 0.56,
  },
  {
    timestamp: '2024-01-10T06:00:00Z',
    Yes: 0.447,
    No: 0.553,
  },
  {
    timestamp: '2024-01-10T07:00:00Z',
    Yes: 0.453,
    No: 0.547,
  },
  {
    timestamp: '2024-01-10T13:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-10T17:00:00Z',
    Yes: 0.456,
    No: 0.544,
  },
  {
    timestamp: '2024-01-10T18:00:00Z',
    Yes: 0.458,
    No: 0.542,
  },
  {
    timestamp: '2024-01-10T22:00:00Z',
    Yes: 0.452,
    No: 0.548,
  },
  {
    timestamp: '2024-01-10T23:00:00Z',
    Yes: 0.447,
    No: 0.553,
  },
  {
    timestamp: '2024-01-11T01:00:00Z',
    Yes: 0.454,
    No: 0.546,
  },
  {
    timestamp: '2024-01-11T03:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-11T06:00:00Z',
    Yes: 0.45,
    No: 0.55,
  },
  {
    timestamp: '2024-01-11T08:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-11T14:00:00Z',
    Yes: 0.454,
    No: 0.546,
  },
  {
    timestamp: '2024-01-11T15:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-11T16:00:00Z',
    Yes: 0.454,
    No: 0.546,
  },
  {
    timestamp: '2024-01-11T17:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-11T18:00:00Z',
    Yes: 0.444,
    No: 0.556,
  },
  {
    timestamp: '2024-01-11T19:00:00Z',
    Yes: 0.444,
    No: 0.556,
  },
  {
    timestamp: '2024-01-11T22:00:00Z',
    Yes: 0.437,
    No: 0.563,
  },
  {
    timestamp: '2024-01-12T00:00:00Z',
    Yes: 0.446,
    No: 0.554,
  },
  {
    timestamp: '2024-01-12T06:00:00Z',
    Yes: 0.452,
    No: 0.548,
  },
  {
    timestamp: '2024-01-12T07:00:00Z',
    Yes: 0.461,
    No: 0.539,
  },
  {
    timestamp: '2024-01-12T10:00:00Z',
    Yes: 0.468,
    No: 0.532,
  },
  {
    timestamp: '2024-01-12T15:00:00Z',
    Yes: 0.476,
    No: 0.524,
  },
  {
    timestamp: '2024-01-12T17:00:00Z',
    Yes: 0.471,
    No: 0.529,
  },
  {
    timestamp: '2024-01-12T22:00:00Z',
    Yes: 0.48,
    No: 0.52,
  },
  {
    timestamp: '2024-01-13T04:00:00Z',
    Yes: 0.479,
    No: 0.521,
  },
  {
    timestamp: '2024-01-13T09:00:00Z',
    Yes: 0.48,
    No: 0.52,
  },
  {
    timestamp: '2024-01-13T15:00:00Z',
    Yes: 0.479,
    No: 0.521,
  },
  {
    timestamp: '2024-01-13T19:00:00Z',
    Yes: 0.471,
    No: 0.529,
  },
  {
    timestamp: '2024-01-13T23:00:00Z',
    Yes: 0.478,
    No: 0.522,
  },
  {
    timestamp: '2024-01-14T02:00:00Z',
    Yes: 0.476,
    No: 0.524,
  },
  {
    timestamp: '2024-01-14T04:00:00Z',
    Yes: 0.484,
    No: 0.516,
  },
  {
    timestamp: '2024-01-14T10:00:00Z',
    Yes: 0.475,
    No: 0.525,
  },
  {
    timestamp: '2024-01-14T11:00:00Z',
    Yes: 0.477,
    No: 0.523,
  },
  {
    timestamp: '2024-01-14T15:00:00Z',
    Yes: 0.481,
    No: 0.519,
  },
  {
    timestamp: '2024-01-14T17:00:00Z',
    Yes: 0.474,
    No: 0.526,
  },
  {
    timestamp: '2024-01-14T19:00:00Z',
    Yes: 0.476,
    No: 0.524,
  },
  {
    timestamp: '2024-01-14T20:00:00Z',
    Yes: 0.468,
    No: 0.532,
  },
  {
    timestamp: '2024-01-15T02:00:00Z',
    Yes: 0.466,
    No: 0.534,
  },
  {
    timestamp: '2024-01-15T06:00:00Z',
    Yes: 0.462,
    No: 0.538,
  },
  {
    timestamp: '2024-01-15T12:00:00Z',
    Yes: 0.468,
    No: 0.532,
  },
  {
    timestamp: '2024-01-15T14:00:00Z',
    Yes: 0.474,
    No: 0.526,
  },
  {
    timestamp: '2024-01-15T19:00:00Z',
    Yes: 0.467,
    No: 0.533,
  },
  {
    timestamp: '2024-01-16T01:00:00Z',
    Yes: 0.463,
    No: 0.537,
  },
  {
    timestamp: '2024-01-16T02:00:00Z',
    Yes: 0.47,
    No: 0.53,
  },
  {
    timestamp: '2024-01-16T05:00:00Z',
    Yes: 0.478,
    No: 0.522,
  },
  {
    timestamp: '2024-01-16T06:00:00Z',
    Yes: 0.474,
    No: 0.526,
  },
  {
    timestamp: '2024-01-16T08:00:00Z',
    Yes: 0.477,
    No: 0.523,
  },
  {
    timestamp: '2024-01-16T09:00:00Z',
    Yes: 0.481,
    No: 0.519,
  },
  {
    timestamp: '2024-01-16T13:00:00Z',
    Yes: 0.485,
    No: 0.515,
  },
  {
    timestamp: '2024-01-16T17:00:00Z',
    Yes: 0.49,
    No: 0.51,
  },
  {
    timestamp: '2024-01-16T18:00:00Z',
    Yes: 0.489,
    No: 0.511,
  },
  {
    timestamp: '2024-01-16T19:00:00Z',
    Yes: 0.49,
    No: 0.51,
  },
  {
    timestamp: '2024-01-17T01:00:00Z',
    Yes: 0.492,
    No: 0.508,
  },
  {
    timestamp: '2024-01-17T06:00:00Z',
    Yes: 0.49,
    No: 0.51,
  },
  {
    timestamp: '2024-01-17T08:00:00Z',
    Yes: 0.494,
    No: 0.506,
  },
  {
    timestamp: '2024-01-17T14:00:00Z',
    Yes: 0.486,
    No: 0.514,
  },
  {
    timestamp: '2024-01-17T17:00:00Z',
    Yes: 0.487,
    No: 0.513,
  },
  {
    timestamp: '2024-01-17T22:00:00Z',
    Yes: 0.492,
    No: 0.508,
  },
  {
    timestamp: '2024-01-18T03:00:00Z',
    Yes: 0.489,
    No: 0.511,
  },
  {
    timestamp: '2024-01-18T09:00:00Z',
    Yes: 0.483,
    No: 0.517,
  },
  {
    timestamp: '2024-01-18T10:00:00Z',
    Yes: 0.481,
    No: 0.519,
  },
  {
    timestamp: '2024-01-18T16:00:00Z',
    Yes: 0.474,
    No: 0.526,
  },
  {
    timestamp: '2024-01-18T17:00:00Z',
    Yes: 0.478,
    No: 0.522,
  },
  {
    timestamp: '2024-01-18T21:00:00Z',
    Yes: 0.476,
    No: 0.524,
  },
  {
    timestamp: '2024-01-18T22:00:00Z',
    Yes: 0.467,
    No: 0.533,
  },
  {
    timestamp: '2024-01-19T02:00:00Z',
    Yes: 0.461,
    No: 0.539,
  },
  {
    timestamp: '2024-01-19T04:00:00Z',
    Yes: 0.456,
    No: 0.544,
  },
  {
    timestamp: '2024-01-19T09:00:00Z',
    Yes: 0.447,
    No: 0.553,
  },
  {
    timestamp: '2024-01-19T12:00:00Z',
    Yes: 0.445,
    No: 0.555,
  },
  {
    timestamp: '2024-01-19T18:00:00Z',
    Yes: 0.44,
    No: 0.56,
  },
  {
    timestamp: '2024-01-19T19:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-19T20:00:00Z',
    Yes: 0.433,
    No: 0.567,
  },
  {
    timestamp: '2024-01-20T02:00:00Z',
    Yes: 0.441,
    No: 0.559,
  },
  {
    timestamp: '2024-01-20T03:00:00Z',
    Yes: 0.444,
    No: 0.556,
  },
  {
    timestamp: '2024-01-20T08:00:00Z',
    Yes: 0.447,
    No: 0.553,
  },
  {
    timestamp: '2024-01-20T11:00:00Z',
    Yes: 0.454,
    No: 0.546,
  },
  {
    timestamp: '2024-01-20T14:00:00Z',
    Yes: 0.451,
    No: 0.549,
  },
  {
    timestamp: '2024-01-20T16:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-20T18:00:00Z',
    Yes: 0.441,
    No: 0.559,
  },
  {
    timestamp: '2024-01-20T22:00:00Z',
    Yes: 0.443,
    No: 0.557,
  },
  {
    timestamp: '2024-01-21T04:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-21T10:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-21T14:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-21T15:00:00Z',
    Yes: 0.449,
    No: 0.551,
  },
  {
    timestamp: '2024-01-21T17:00:00Z',
    Yes: 0.447,
    No: 0.553,
  },
  {
    timestamp: '2024-01-21T20:00:00Z',
    Yes: 0.444,
    No: 0.556,
  },
  {
    timestamp: '2024-01-21T22:00:00Z',
    Yes: 0.448,
    No: 0.552,
  },
  {
    timestamp: '2024-01-22T03:00:00Z',
    Yes: 0.455,
    No: 0.545,
  },
  {
    timestamp: '2024-01-22T04:00:00Z',
    Yes: 0.459,
    No: 0.541,
  },
  {
    timestamp: '2024-01-22T08:00:00Z',
    Yes: 0.449,
    No: 0.551,
  },
  {
    timestamp: '2024-01-22T12:00:00Z',
    Yes: 0.456,
    No: 0.544,
  },
  {
    timestamp: '2024-01-22T13:00:00Z',
    Yes: 0.466,
    No: 0.534,
  },
  {
    timestamp: '2024-01-22T18:00:00Z',
    Yes: 0.466,
    No: 0.534,
  },
  {
    timestamp: '2024-01-22T19:00:00Z',
    Yes: 0.467,
    No: 0.533,
  },
  {
    timestamp: '2024-01-22T20:00:00Z',
    Yes: 0.463,
    No: 0.537,
  },
  {
    timestamp: '2024-01-22T21:00:00Z',
    Yes: 0.454,
    No: 0.546,
  },
  {
    timestamp: '2024-01-23T00:00:00Z',
    Yes: 0.453,
    No: 0.547,
  },
  {
    timestamp: '2024-01-23T02:00:00Z',
    Yes: 0.45,
    No: 0.55,
  },
  {
    timestamp: '2024-01-23T03:00:00Z',
    Yes: 0.445,
    No: 0.555,
  },
  {
    timestamp: '2024-01-23T04:00:00Z',
    Yes: 0.445,
    No: 0.555,
  },
  {
    timestamp: '2024-01-23T06:00:00Z',
    Yes: 0.435,
    No: 0.565,
  },
  {
    timestamp: '2024-01-23T10:00:00Z',
    Yes: 0.426,
    No: 0.574,
  },
  {
    timestamp: '2024-01-23T15:00:00Z',
    Yes: 0.417,
    No: 0.583,
  },
  {
    timestamp: '2024-01-23T20:00:00Z',
    Yes: 0.419,
    No: 0.581,
  },
  {
    timestamp: '2024-01-23T23:00:00Z',
    Yes: 0.417,
    No: 0.583,
  },
  {
    timestamp: '2024-01-24T02:00:00Z',
    Yes: 0.418,
    No: 0.582,
  },
  {
    timestamp: '2024-01-24T05:00:00Z',
    Yes: 0.419,
    No: 0.581,
  },
  {
    timestamp: '2024-01-24T08:00:00Z',
    Yes: 0.429,
    No: 0.571,
  },
  {
    timestamp: '2024-01-24T10:00:00Z',
    Yes: 0.426,
    No: 0.574,
  },
  {
    timestamp: '2024-01-24T16:00:00Z',
    Yes: 0.42,
    No: 0.58,
  },
  {
    timestamp: '2024-01-24T20:00:00Z',
    Yes: 0.413,
    No: 0.587,
  },
  {
    timestamp: '2024-01-24T23:00:00Z',
    Yes: 0.411,
    No: 0.589,
  },
  {
    timestamp: '2024-01-25T00:00:00Z',
    Yes: 0.41,
    No: 0.59,
  },
  {
    timestamp: '2024-01-25T05:00:00Z',
    Yes: 0.401,
    No: 0.599,
  },
  {
    timestamp: '2024-01-25T06:00:00Z',
    Yes: 0.405,
    No: 0.595,
  },
  {
    timestamp: '2024-01-25T09:00:00Z',
    Yes: 0.409,
    No: 0.591,
  },
  {
    timestamp: '2024-01-25T14:00:00Z',
    Yes: 0.41,
    No: 0.59,
  },
  {
    timestamp: '2024-01-25T20:00:00Z',
    Yes: 0.408,
    No: 0.592,
  },
  {
    timestamp: '2024-01-26T00:00:00Z',
    Yes: 0.406,
    No: 0.594,
  },
  {
    timestamp: '2024-01-26T01:00:00Z',
    Yes: 0.41,
    No: 0.59,
  },
  {
    timestamp: '2024-01-26T02:00:00Z',
    Yes: 0.419,
    No: 0.581,
  },
  {
    timestamp: '2024-01-26T07:00:00Z',
    Yes: 0.421,
    No: 0.579,
  },
  {
    timestamp: '2024-01-26T09:00:00Z',
    Yes: 0.431,
    No: 0.569,
  },
  {
    timestamp: '2024-01-26T15:00:00Z',
    Yes: 0.435,
    No: 0.565,
  },
  {
    timestamp: '2024-01-26T19:00:00Z',
    Yes: 0.429,
    No: 0.571,
  },
  {
    timestamp: '2024-01-26T23:00:00Z',
    Yes: 0.427,
    No: 0.573,
  },
  {
    timestamp: '2024-01-27T01:00:00Z',
    Yes: 0.435,
    No: 0.565,
  },
  {
    timestamp: '2024-01-27T04:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-27T10:00:00Z',
    Yes: 0.451,
    No: 0.549,
  },
  {
    timestamp: '2024-01-27T11:00:00Z',
    Yes: 0.441,
    No: 0.559,
  },
  {
    timestamp: '2024-01-27T16:00:00Z',
    Yes: 0.451,
    No: 0.549,
  },
  {
    timestamp: '2024-01-27T21:00:00Z',
    Yes: 0.444,
    No: 0.556,
  },
  {
    timestamp: '2024-01-27T23:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-28T03:00:00Z',
    Yes: 0.442,
    No: 0.558,
  },
  {
    timestamp: '2024-01-28T06:00:00Z',
    Yes: 0.439,
    No: 0.561,
  },
  {
    timestamp: '2024-01-28T09:00:00Z',
    Yes: 0.432,
    No: 0.568,
  },
  {
    timestamp: '2024-01-28T10:00:00Z',
    Yes: 0.428,
    No: 0.572,
  },
  {
    timestamp: '2024-01-28T13:00:00Z',
    Yes: 0.427,
    No: 0.573,
  },
]

const chartConfig = {
  Yes: {
    label: 'Yes',
    color: 'var(--chart-yes)',
  },
  No: {
    label: 'No',
    color: 'var(--chart-no)',
  },
} satisfies ChartConfig

export function ChartLine() {
  return (
    <LineChart data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="timestamp"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) =>
          new Date(value).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
          })
        }
      />
      <YAxis
        type="number"
        domain={[0, 1]}
        ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
      />
      <ChartTooltip
        cursor={{
          stroke: 'var(--color-Yes)',
          strokeWidth: 1,
          strokeDasharray: '3 3',
        }}
        formatter={(value: number, name: string) => {
          const config = chartConfig[name as keyof typeof chartConfig]
          return [`${(value * 100).toFixed(2)}%`, config ? config.label : name]
        }}
        content={<ChartTooltipContent indicator="line" />}
      />
      <Line
        type="step"
        dataKey="Yes"
        stroke="var(--color-Yes)"
        strokeWidth={2}
        dot={false}
      />
      <Line
        type="step"
        dataKey="No"
        stroke="var(--color-No)"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  )
}
