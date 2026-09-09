   W SUFFERS — Math & Physics Utility Helpers

export class MathUtils {
  static lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  static clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  static randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Fast 3D Axis-Aligned Bounding Box (AABB) intersection check.
   */
  static checkAABBIntersect(box1, box2) {
    return (
      box1.min.x <= box2.max.x &&
      box1.max.x >= box2.min.x &&
      box1.min.y <= box2.max.y &&
      box1.max.y >= box2.min.y &&
      box1.min.z <= box2.max.z &&
      box1.max.z >= box2.min.z
    );
  }

  /**
   * Distance between two 3D points.
   */
  static distance3D(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
