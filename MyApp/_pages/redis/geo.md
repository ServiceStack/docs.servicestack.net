---
slug: geo
title: Geospatial Queries with Redis GEO
---

Redis GEO commands store longitude/latitude points and answer "what's near here?" in milliseconds, which covers
store locators, nearby drivers and couriers, "people near you" and geofencing without a spatial database.
A GEO set is a Sorted Set whose scores are geohashes, so each member is a unique location ID.

<geo-radius>
</geo-radius>

## Add locations

`AddGeoMember` adds or moves one member, and `AddGeoMembers` adds several in one command. Arguments are
**longitude first**, then latitude:

```csharp
using var redis = redisManager.GetClient();
redis.AddGeoMembers("stores",
    new RedisGeo(-122.4194, 37.7749, "store:sf-downtown"),
    new RedisGeo(-122.2711, 37.8044, "store:oakland"),
    new RedisGeo(-122.0322, 37.3230, "store:cupertino"),
    new RedisGeo(-118.2437, 34.0522, "store:los-angeles"));
```

Store only the ID in the GEO set and keep each location's details, like name, address and opening hours, in its
own key. Valid longitudes are -180 to 180, and latitudes -85.05 to 85.05.

## Find what's nearby

`FindGeoResultsInRadius` returns members within a radius of a point, with their distance and coordinates.
Limit the count and sort by distance to get the nearest results:

```csharp
List<RedisGeoResult> nearby = redis.FindGeoResultsInRadius("stores",
    longitude: -122.4089, latitude: 37.7837,
    radius: 25, unit: RedisGeoUnit.Kilometers,
    count: 5, sortByNearest: true);

foreach (var store in nearby)
    Console.WriteLine($"{store.Member}: {store.Distance:N1} km");
// store:sf-downtown: 1.3 km
// store:oakland: 12.3 km
```

`RedisGeoUnit` provides `Meters`, `Kilometers`, `Miles` and `Feet`. Use `FindGeoMembersInRadius` when you only need
the member IDs:

```csharp
string[] ids = redis.FindGeoMembersInRadius("stores", -122.4089, 37.7837, 25, RedisGeoUnit.Kilometers);
```

Both also accept an existing member as the center, e.g. stores within 15 km of another store:

```csharp
string[] closeBy = redis.FindGeoMembersInRadius("stores", "store:sf-downtown", 15, RedisGeoUnit.Kilometers);
// store:sf-downtown, store:oakland
```

## Distances and coordinates

```csharp
double km = redis.CalculateDistanceBetweenGeoMembers("stores",
    "store:sf-downtown", "store:los-angeles", RedisGeoUnit.Kilometers);   // ~559

List<RedisGeo> coords = redis.GetGeoCoordinates("stores", "store:oakland");
string[] hashes = redis.GetGeohashes("stores", "store:oakland");          // e.g. for map tiles
```

Distances are calculated on a sphere, accurate to within 0.5%, which is ample for "nearest store" and
"distance to driver" but not for surveying.

## Track moving objects

Updating a member's position is the same `AddGeoMember` call: a member is never duplicated, it moves. That
makes tracking live positions, such as delivery drivers, a single command per location update:

```csharp
// Each driver's app reports its position every few seconds
redis.AddGeoMember("drivers:available", lng, lat, $"driver:{driverId}");

// Find the 3 closest available drivers to a pickup
var closest = redis.FindGeoResultsInRadius("drivers:available", pickupLng, pickupLat,
    5, RedisGeoUnit.Kilometers, count: 3, sortByNearest: true);

// Remove a driver when they accept a job or go offline
redis.RemoveItemFromSortedSet("drivers:available", $"driver:{driverId}");
```

GEO members don't expire individually. To drop drivers whose app stopped reporting, keep their last-seen time
in a second Sorted Set and periodically remove stale members from both:

```csharp
var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
redis.AddItemToSortedSet("drivers:last-seen", $"driver:{driverId}", now); // on every update

// Periodically: remove drivers not seen in the last 2 minutes
var stale = redis.GetRangeFromSortedSetByLowestScore("drivers:last-seen", 0, now - 120);
if (stale.Count > 0)
{
    redis.RemoveItemsFromSortedSet("drivers:available", stale);
    redis.RemoveItemsFromSortedSet("drivers:last-seen", stale);
}
```

## Geofencing

To check whether a point is within range of a location, query a small radius around the point and look for the
location's ID, or compare the distance directly:

```csharp
redis.AddGeoMember("geofence:warehouses", -122.39, 37.77, "warehouse:sf");
redis.AddGeoMember("geofence:warehouses", deliveryLng, deliveryLat, "delivery:42");

var meters = redis.CalculateDistanceBetweenGeoMembers("geofence:warehouses",
    "warehouse:sf", "delivery:42", RedisGeoUnit.Meters);
bool arrived = meters < 200;
```

## Async

```csharp
await using var redis = await redisManager.GetClientAsync(token);
await redis.AddGeoMemberAsync("stores", -122.4194, 37.7749, "store:sf-downtown", token);
var nearby = await redis.FindGeoResultsInRadiusAsync("stores", -122.4089, 37.7837,
    25, RedisGeoUnit.Kilometers, count: 5, sortByNearest: true, token: token);
```

For a complete example app, see [Redis GEO](https://github.com/ServiceStackApps/redis-geo), which finds US
cities near any point on an interactive map.
